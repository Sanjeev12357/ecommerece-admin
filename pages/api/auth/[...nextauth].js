import NextAuth, { getServerSession } from 'next-auth'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import GithubProvider from "next-auth/providers/github"

const adminEmails = ['sanjeevsinghsaini48@gmail.com','adi6tnine@gmail.com']

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    // Add error logging
    async signIn({ user, account, profile }) {
      return true
    },
    async session({ session, user }) {
      return session
    }
  },
  // Add better error handling
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)

export async function isAdminRequest(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.email) {
      res.status(401).json({ error: 'Not authenticated' })
      return false
    }

    if (!adminEmails.includes(session.user.email)) {
      res.status(403).json({ error: 'Not authorized' })
      return false
    }

    return true
  } catch (error) {
    console.error('Admin verification error:', error)
    res.status(500).json({ error: 'Internal server error' })
    return false
  }
}