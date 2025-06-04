const axios = require('axios');
const https = require("https");
const { VIRUSTOTAL_API_KEY } = require('../config');
const { extractHost } = require('../utils/extractHost');


exports.checkDomain = async (req, res) => {
    let { domain } = req.query;
    domain = extractHost(domain);
    if (!domain) return res.status(400).json({ error: "Домен не указан" });
    try {
        const response = await axios.get(`https://www.virustotal.com/api/v3/domains/${domain}`, {
            headers: { "x-apikey": VIRUSTOTAL_API_KEY }, httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        //const data = response.data;
        const stats = response.data.data.attributes.last_analysis_stats;
        const detailedResult = response.data.data.attributes.last_analysis_results;
        const reputation = response.data.data.attributes.reputation;



        res.json({ stats, reputation, detailedResult });
    } catch (error) {
        res.status(500).json({ error: "Ошибка при проверке домена" });
    }
};
