import { Metadata, FieldValue } from './Metadata';

interface IUser extends Metadata {
  readonly uid: string;
  readonly tenantId?: string | null;
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
  emailVerified: boolean;
  phoneNumber?: string | null;
}

/**
 * Represents a normal user.
 *
 * @class User
 * @typedef {User}
 * @implements {IUser}
 */
class User implements IUser {
  readonly uid: string;
  readonly tenantId: string | null;
  photoURL: string | null;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  updatedAt: FieldValue;
  readonly createdAt: FieldValue;

  /**
   * Creates an instance of User.
   *
   * @constructor
   * @param {IUser} {
      uid,
      tenantId,
      photoURL,
      displayName,
      email,
      emailVerified,
      phoneNumber,
      updatedAt,
      createdAt,
    }
   */
  constructor({
    uid,
    tenantId,
    photoURL,
    displayName,
    email,
    emailVerified,
    phoneNumber,
    updatedAt,
    createdAt,
  }: IUser) {
    this.uid = uid;
    this.tenantId = tenantId || null;
    this.photoURL = photoURL || null;
    this.displayName = displayName || null;
    this.email = email || null;
    this.emailVerified = emailVerified;
    this.phoneNumber = phoneNumber || null;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }

  /**
   * Serialize to object for saving into Firestore.
   *
   * @public
   * @return  {object}
   */
  public toObject(): object {
    return Object.assign({}, this);
  }
}

export { User };
