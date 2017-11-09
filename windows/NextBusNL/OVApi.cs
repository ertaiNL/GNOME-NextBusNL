using System;
using System.Linq;
using System.Net;
using Newtonsoft.Json.Linq;

namespace NextBusNL
{
    class OVApi
    {
        public static string getNextBus()
        {
            string _baseUrl = "http://kv78turbo.ovapi.nl/tpc/";
            string _timingPointCode = "TO_BE_FILLED";

            string webResult;
            string resultString = "";

            using (WebClient client = new WebClient())
            {
                webResult = client.DownloadString(_baseUrl + _timingPointCode);
            }

            if (string.IsNullOrWhiteSpace(webResult))
            {
                return "Call failed (1)";
            }

            var jObj = JObject.Parse(webResult);
            if (jObj == null)
            {
                return "Call failed (2)";
            }

            var tokens = jObj.SelectTokens("$." + _timingPointCode + ".Passes.*").OrderBy(o => o.SelectToken("$.ExpectedDepartureTime")).Take(3);
            foreach (var token in tokens)
            {
                resultString = resultString + token.SelectToken("$.ExpectedDepartureTime") + " -> " + token.SelectToken("$.LinePublicNumber") + "\n";
            }

            if (string.IsNullOrWhiteSpace(resultString))
            {
                return "No busses found (3)";
            }
            return resultString;
        }
    }
}
