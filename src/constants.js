export const PORT = process.env.PORT;
export const BIND = process.env.BIND;

export const IS_PROD = process.env.NODE_ENV?.startsWith("prod");

// upload limit size (byte)
export const LIMIT_SIZE = 20_000_000; // around 20mb
