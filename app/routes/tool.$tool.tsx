import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import FloatingMenu from "~/component/FloatingMenu";

import { getUserSession } from "~/services/session.server";
import { getCombineTools } from "~/utils/combineTools";

export const loader: LoaderFunction = async ({ request, params }) => {
  let user = await getUserSession(request);
  if (!user) redirect("/");
  let toolname = params.tool;

  let toolList = await getCombineTools(user?.email);
  if (toolList.find((d) => d.name === toolname)) {
    let filtered = toolList.filter((tool) => tool.name === toolname);
    let url = filtered[0].url;
    if (!filtered[0].url.includes("session")) {
      console.log(url);
      url = filtered[0].url + "?session=" + user?.email;
    }

    return {
      url,
      toolname,
      user,
    };
  }
  return null;
};

export const meta: MetaFunction = ({ params }) => {
  let toolname = params.tool;
  return [
    { title: `Pecha_tools | ${toolname}` },
    {
      name: "description",
      content: "monlam tools is collection of tool used for mt",
    },
  ];
};

function Tool() {
  const { url } = useLoaderData();
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
      <div className="relative  overflow-hidden h-[100dvh]">
        {!loaded && <Loading />}
        <iframe
          src={url}
          onLoad={onLoadFunction}
          ref={iframeRef}
          allow="microphone; camera; midi; clipboard-read; clipboard-write"
        ></iframe>
        <FloatingMenu />
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
