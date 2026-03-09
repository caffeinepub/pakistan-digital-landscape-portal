import Map "mo:core/Map";
import Auth "authorization/access-control";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

actor {
  // User profile types
  type UserProfile = {
    email : Text;
    password : Text; // In production use, store password hash instead!
  };

  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      a.email.compare(b.email);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Access control
  let accessControlState = Auth.initState();

  public shared ({ caller }) func initializeAccessControl() : async () {
    Auth.initialize(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : Auth.UserRole) : async () {
    Auth.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func getCallerUserRole() : async Auth.UserRole {
    Auth.getUserRole(accessControlState, caller);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    Auth.isAdmin(accessControlState, caller);
  };

  // Authentication - anyone can attempt to authenticate (including guests)
  // This is intentionally open as it's the entry point for login
  public shared ({ caller }) func authenticate(email : Text, password : Text) : async Bool {
    let userExists = userProfiles.values().find(
      func(profile) { profile.email == email and profile.password == password }
    );
    userExists.isSome();
  };

  // Register new user (admin only)
  public shared ({ caller }) func registerUser(email : Text, password : Text) : async () {
    if (not (Auth.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can register users");
    };
    // Email uniqueness check
    let emailExists = switch (userProfiles.values().find(func(profile) { profile.email == email })) {
      case (?_) { true };
      case (null) { false };
    };
    if (emailExists) { Runtime.trap("Email address already exists!") };
    let profile : UserProfile = {
      email;
      password;
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (Auth.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (Auth.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not Auth.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (Auth.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    userProfiles.values().toArray().sort();
  };
};
