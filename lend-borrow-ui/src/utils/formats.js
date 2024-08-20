const formatAddress = (address) => {
  let trimmedAddress =
    address.substring(0, 4) +
    "..." +
    address.substring(address.length - 7, address.length);
  return trimmedAddress;
};

export default formatAddress;
