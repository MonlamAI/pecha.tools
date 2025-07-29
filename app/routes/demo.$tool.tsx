import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import FloatingMenu from "~/component/FloatingMenu";
import { getTools } from "~/modal/tool";
import { getUserSession } from "~/services/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  let toolname = params.tool;
  let user = await getUserSession(request);
  let { AUTH0_DOMAIN, AUTH0_CLIENT_ID, NODE_ENV } = process.env;
  const toolList = await getTools();
  if (toolList.find((d) => d.name === toolname)) {
    let filtered = toolList.find((tool) => tool.name === toolname);
    let url = filtered?.demo;
    return {
      user,
      url,
      toolname,
      env: { AUTH0_DOMAIN, AUTH0_CLIENT_ID, NODE_ENV },
    };
  }
};
export const meta: MetaFunction = ({ params }) => {
  let toolname = params.tool;
  return [
    { title: `Monlam_tools | demo-${toolname}` },
    {
      name: "description",
      content: `demo of monlam tools - ${toolname}`,
    },
  ];
};
function Tool() {
  const { url, user } = useLoaderData();
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef(null);
  function onLoadFunction() {
    const iframe = iframeRef.current;
    if (iframe) {
    }
    setLoaded(true);
  }
  return (
    <>
      <div className="relative overflow-hidden h-[100dvh]">
        {!loaded && <Loading />}
        <iframe src={url} onLoad={onLoadFunction} ref={iframeRef}></iframe>
        {user && <FloatingMenu />}
      </div>
    </>
  );
}

export default Tool;

function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100dvh",
      }}
    >
      loading.... wait for a moment
    </div>
  );
}
