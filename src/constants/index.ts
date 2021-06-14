export const PADDING: number = 8;
export const MARGIN: number = 12;

export const ANT_COUNT = 3;
export const ANT_SIZE = 25;

export const GRAPHQL_API: string =
  'https://guarded-shore-81814.herokuapp.com/graphql';

export const GET_ANTS_QUERY: string = `
query ants {
  ants {
    name
    length
    weight
    color
  }
}
`;

export const IS_LOGIN = 'is_login';
