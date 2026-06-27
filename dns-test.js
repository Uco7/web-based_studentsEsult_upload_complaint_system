const dns = require("dns").promises;

(async () => {
  try {
    const result = await dns.resolveSrv(
      "_mongodb._tcp.cluster0.eocbfjd.mongodb.net"
    );

    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();