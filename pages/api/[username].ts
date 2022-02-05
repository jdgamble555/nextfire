// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  //req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.statusCode = 200;
  res.json({ name: '' });
}
