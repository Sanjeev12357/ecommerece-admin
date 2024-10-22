import NextAuth, {getServerSession} from 'next-auth'

import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb";
import GithubProvider from "next-auth/providers/github"

const adminEmails = ['sanjeevsinghsaini48@gmail.com'];


export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    // ...add more providers here
  ],
  adapter:MongoDBAdapter(clientPromise)
}



export default NextAuth(authOptions);

export async function isAdminRequest(req,res) {
  const session = await getServerSession(req,res,authOptions);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}
