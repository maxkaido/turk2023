import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";

const faqs = [
  {
    question: "What is the purpose of the ElectionBetting contract?",
    answer:
      "The ElectionBetting contract is a betting system for an election. Users can place bets on candidates, withdraw their bets, and claim their winnings. The contract also handles the distribution of winnings and calculates service fees.",
  },
  {
    question: "Who are the candidates in this betting system?",
    answer:
      "The candidates are 'Kemal' and 'Erdogan'. Bets can only be placed on these two candidates.",
  },
  {
    question: "What is the role of the Chainlink oracle in this contract?",
    answer:
      "The Chainlink oracle is used to get the election result from an external API. The result is then used to determine the winner of the bets.",
  },
  {
    question: "What is the service fee and how is it calculated?",
    answer:
      "The service fee is a percentage of the payout amount. It is calculated during the distribution of winnings. The service fee percentage and the wallet to which the fee is transferred can be set by the contract owner.",
  },
  {
    question: "What is the bettingEndTime?",
    answer:
      "The bettingEndTime is a timestamp that signifies the end of the betting period. No bets can be placed or withdrawn after this time.",
  },
  {
    question: "How are winnings distributed?",
    answer:
      "Winnings are distributed in batches. The contract calculates the total bet amount for the winning candidate and distributes the winnings to the users who bet on that candidate. The distribution is done in batches to prevent exceeding the gas limit.",
  },
  {
    question: "How can a user claim their winnings?",
    answer:
      "Users can claim their winnings by calling the claimWinnings function. The winnings are then transferred to the user's address.",
  },
  {
    question: "Can the contract owner manually declare a winner?",
    answer:
      "Yes, the contract owner can manually declare a winner by calling the declareWinner function. However, this can only be done one week after the betting end time.",
  },
  {
    question:
      "What happens if a user tries to withdraw their bet after the betting end time?",
    answer:
      "The contract will not allow a user to withdraw their bet after the betting end time. The withdraw function checks the current time against the betting end time and reverts if the current time is later.",
  },
  {
    question: "What is the purpose of the ReentrancyGuard?",
    answer:
      "The ReentrancyGuard is a security feature that prevents reentrant calls to certain functions. This is important to prevent potential attacks where an untrusted contract could call back into the calling contract before the first call was finished.",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FAQComponent() {
  return (
    <div className="bg-gray-50" id="faq">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-6 divide-y divide-gray-200">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt className="text-lg">
                      <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                        <span className="font-medium text-gray-900">
                          {faq.question}
                        </span>
                        <span className="ml-6 h-7 flex items-center">
                          <ChevronDownIcon
                            className={classNames(
                              open ? "-rotate-180" : "rotate-0",
                              "h-6 w-6 transform"
                            )}
                            aria-hidden="true"
                          />
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base text-gray-500">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
