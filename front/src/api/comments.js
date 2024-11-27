import axios, { endpoints } from 'src/utils/axios';

// post new comment
export async function usePostComment(acommentData) {
  const res = await axios.post(endpoints.commentaire.addComment, acommentData);
  return res;
}
