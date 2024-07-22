export interface IUpdateNaws {
    text: string
    logo?: any | null;
    files?: any[] | null;
    quotes?: any;
}

export interface INews {
    _id: string;
  author: string;
  text: string;
  quotes: string;
  logo?: string | null;
  files?: string[] | File[] | null;
  publicDate: string
  username: string
}

export interface INewsPayload {
  _id?: string;
  author: string;
  text: string;
  quotes?: string[];
  logo?: File;
  files?: File[];
  publicDate?: Date | null;
}

export type INewsInputs = {
  author: string;
  text: string;
  quotes?: string[];
  publicDate?: Date | null;
  logo?: any;
  files?: any[];
};

export type ITokens = {
  accessToken: string;
  refreshToken: string;
};


export interface IUserPayload {
  user: IUser;
}

export interface AuthCheckResponse {
  user: IUserAuth
  accessToken: string;
  refreshToken: string;

}

export type IPayloadType ={
  payload: AuthResponse
}

export interface AuthResponse {
  tokens: ITokens;
  user: {
    _id: string;
    username: string;
  };
  message?:string
  errors?: IErrorPayload
}

export type IErrorPayload = {
  errors: {
    msg: string
  }[];
}



//!--
export type IUser = {
  username: string;
  password: string;
  _id?: string;
};

export type IUserAuth = {
  username: string;
  _id: string;
};

export type IUserLogRes = {
  username: string;
  _id: string;
  accessToken: string;
};

export interface IUserPayload {
  user: IUser;
}

export interface AuthCheckResponse {
  user: IUserAuth;
  accessToken: string;
  refreshToken: string;
}

//!--
export interface ILoginInputs {
  username: string;
  password: string;
}

export interface LogoProps {
    url: string | null;
    name: string | null;
  }

export type AllNewsType = Array<INews>;
