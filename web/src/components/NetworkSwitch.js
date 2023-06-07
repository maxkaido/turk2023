import Switch from "react-switch";

const networks = {
  dev: {
    name: "Dev",
    contractAddress: "n/a",
  },
  sepolia: {
    name: "Sepolia",
    contractAddress: "0xd00877f1b2c5e38908e4AD6692A01B1E917C9CCc",
  },
  avalanche: {
    name: "Avalanche",
    contractAddress: "n/a",
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
      <span className="ml-3 text-gray-300">
        {networks[selectedNetwork].name}
      </span>
    </div>
  );
}
