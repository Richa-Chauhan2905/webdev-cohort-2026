import JWT from "jsonwebtoken";

export interface UserTokenPayload {
  id: string;
}

const JWT_SECRET = "myjwttoken";
export function createUserToken(payload: UserTokenPayload) {
  const token = JWT.sign(payload, JWT_SECRET);
  return token;
}
export function verfiyUserToken(token: string) {
  try {
    const payload = JWT.verify(token, JWT_SECRET) as UserTokenPayload;
    return payload;
  } catch (error) {
    return null;
  }
}
