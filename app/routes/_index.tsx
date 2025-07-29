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
    <div className="bg-gradient-to-b from-[#1f2228] to-[#171a1f] min-h-screen flex flex-col text-[#e9eaeb]">
      <Header />

      <div className="mx-auto w-full md:max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col items-center text-center mb-8 max-w-3xl mx-auto">
          <h1
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            style={{
              fontFamily: '"Rubik","Open Sans",sans-serif',
            }}
          >
            Monlam Tools Collection
          </h1>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl">
            A suite of professional tools designed for machine translation and
            text processing
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-8"></div>
        </div>

        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-xl font-semibold text-gray-200">
            Available Tools
          </h2>
        </div>

        <Main tools={data?.tools} />
      </div>
    </div>
  );
}
