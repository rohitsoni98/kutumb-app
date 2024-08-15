import API_SERVICE from "../../../helpers/service/apiService";
const { UPLOAD_FILE, STAGE_CRAFTO } = API_SERVICE;

export const createQuote = async (args) => {
  const { file, username, text } = args;
  const { data } = await UPLOAD_FILE.post(
    "/upload",
    { file },
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return STAGE_CRAFTO.post("/postQuote", {
    text,
    username,
    mediaUrl: data?.[0]?.["url"],
    createdAt: new Date(),
  });
};
