import { MetaFunction, type LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Header from "~/component/Header";
import Main from "~/component/Main";
import { getUserSession } from "~/services/session.server";
import { getCombineTools } from "~/utils/combineTools";

interface Tool {
  name: string;
  icon?: string;
  url?: string;
  demo?: boolean;
  active?: boolean;
}

interface LoaderData {
  user?: {
    email: string;
    name: string;
    picture: string;
  };
  tools: Tool[];
  env: {
    AUTH0_DOMAIN: string | undefined;
    AUTH0_CLIENT_ID: string | undefined;
    NODE_ENV: string | undefined;
  };
}
export const loader: LoaderFunction = async ({ request }) => {
  let user = await getUserSession(request);
  let toolList = await getCombineTools(user?.email);
  let { AUTH0_DOMAIN, AUTH0_CLIENT_ID, NODE_ENV } = process.env;
  return json({
    user,
    tools: toolList,
    env: { AUTH0_DOMAIN, AUTH0_CLIENT_ID, NODE_ENV },
  });
};

export const meta: MetaFunction = () => {
  return [
    { title: "Pecha_tools" },
    {
      name: "description",
      content: "monlam tools is collection of tool used for mt",
    },
  ];
};

export default function Index() {
  let data = useLoaderData<LoaderData>();

  return (
    <div className="bg-gradient-to-b from-slate-50 to-blue-50 min-h-screen flex flex-col text-slate-800">
      <Header />

      <div className="mx-auto w-full md:max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col items-center text-center mb-12 max-w-4xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-700 to-yellow-500 bg-clip-text text-transparent"
            style={{
              fontFamily: '"Rubik","Open Sans",sans-serif',
            }}
          >
            Monlam Tools Collection
          </h1>
          <p className="text-slate-600 text-xl mb-8 max-w-3xl leading-relaxed">
            A comprehensive suite of professional tools designed for machine
            translation and advanced text processing workflows
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-yellow-400 rounded-full mb-8"></div>
        </div>

        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-2xl font-semibold text-slate-700">
            Available Tools
          </h2>
        </div>

        <Main tools={data?.tools} />
      </div>
    </div>
  );
}
