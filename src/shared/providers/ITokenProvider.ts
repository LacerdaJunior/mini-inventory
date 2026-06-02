export type TokenPayload = {
  sub: string;
};

export interface ITokenProvider {
  generateToken(payload: TokenPayload): string;

  verify(token: string): TokenPayload;
}
