import axios from "axios";

export async function fetchTokenPrice(tokenName) {
  try {
    // Replace spaces with hyphens for the API request
    const formattedTokenName = tokenName.toLowerCase().replace(/\s+/g, "-");

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${formattedTokenName}&vs_currencies=usd`;
    const response = await axios.get(url);
    if (
      response.data[formattedTokenName] &&
      response.data[formattedTokenName].usd
    ) {
      return response.data[formattedTokenName].usd;
    } else {
      console.log(`Token ${tokenName} not found on CoinGecko.`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching price for token ${tokenName}:`, error);
    return null;
  }
}
