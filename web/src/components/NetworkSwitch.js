import Switch from "react-switch";

const networks = {
  dev: {
    name: "Dev",
    contractAddress: "<dev_contract_address>",
  },
  sepolia: {
    name: "Sepolia",
    contractAddress: "<sepolia_contract_address>",
  },
  avalanche: {
    name: "Avalanche",
    contractAddress: "0x179cc4C03f6Bea57c70fAcaEa4EdC4E6DC2B2803",
  },
};

export default function NetworkSwitch({ selectedNetwork, onNetworkChange }) {
  const networkOptions = Object.keys(networks);

  const getNextNetwork = (network) => {
    const currentIndex = networkOptions.indexOf(network);
    const nextIndex = (currentIndex + 1) % networkOptions.length;
    return networkOptions[nextIndex];
  };

  return (
    <div className="flex items-center">
      <Switch
        checked={selectedNetwork === "avalanche"}
        onChange={() => {
          const nextNetwork = getNextNetwork(selectedNetwork);
          onNetworkChange(nextNetwork);
        }}
        onColor="#3182CE"
        offColor="#D1D5DB"
        checkedIcon={false}
        uncheckedIcon={false}
        height={24}
        width={48}
        className="relative inline-flex items-center rounded-full"
      />
      <span className="ml-3 text-lg text-gray-300">
        {networks[selectedNetwork].name}
      </span>
    </div>
  );
}
