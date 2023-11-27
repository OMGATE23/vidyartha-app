export default async function handler(req, res) {
    
    let placeid = req.query.id;

    let topDonors = await fetch(`https://shastradaan.ap-south-1.elasticbeanstalk.com/shastradaan/donors/${placeid}/`)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Something went wrong');
        }
    })
    .then(data => data)
    .catch(error => error)
    
    res.status(200).json(topDonors)

}