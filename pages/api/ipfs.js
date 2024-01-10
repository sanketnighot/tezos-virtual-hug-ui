// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pinataSDK from '@pinata/sdk';

const APIKey = "d8bcb3d23c4535fc6335"
const APISecret = "dfae568364d3b967f2f62b1374095ca495d25a4357d2bc3da4166eae83110ad7"
const pinata = new pinataSDK(APIKey, APISecret);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Process a POST request
        const options = {
            pinataMetadata: {
                name: req.body.data.name,
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        try {
            const result = await pinata.pinJSONToIPFS(req.body.data, options)
            return res.send({ hash: result.IpfsHash, status: "success" });

        } catch (err) {
            console.log(err)
            return res.send({ status: "error" });
        }
    }
}
