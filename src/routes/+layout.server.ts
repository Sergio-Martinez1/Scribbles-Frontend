import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { fileURLToPath } from 'url';

export const load: LayoutServerLoad = async ({ cookies, fetch, depends }) => {

  depends('plainUser');
  depends('myReactions');

  const __filename = fileURLToPath(import.meta.url);
  const __route = __filename.slice(__filename.indexOf('src'));

  const base_api_url: string | undefined = env.API_URL;
  if (!base_api_url) console.error(`Error: Error en [${__route}].\n\t- No se encontro la url de la api en el entorno`);

  const access_token = cookies.get('access_token');


  const url = `${base_api_url}/reactions/myReactions`;
  const myReactionsOptions = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${access_token}`
    }
  };

  const options = {
    method: "get",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${access_token}`
    }
  };


  const myReactionsResponse = await fetch(url, myReactionsOptions).then(async (response) => {
    if (response.ok) {
      return await response.json();
    } else if (response.status == 401) {
      return null;
    } else {
      error(response.status, response.statusText);
    }
  }).catch((error) => {
    console.error(`Error: Error en [${__route}].\n\t- Error al intentar obtener "My reactions"\n\t- ${error}`)
  });

  const response = await fetch(`${base_api_url}/users/plainMyUser`, options).then(async (response) => {
    if (response.ok) {
      return await response.json();
    } else if (response.status == 401) {
      return null;
    } else {
      error(response.status, response.statusText);
    }
  }).catch((error) => {
    console.error(`Error: Error en [${__route}].\n\t- Error al intentar obtener "Mi usuario"\n\t- ${error}`);
  }
  );

  return {
    plainMyUser: response,
    myReactions: myReactionsResponse
  };
};
