import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";

const faqs = [
  {
    question: "What is Wiki Wager?",
    answer:
      "Wiki Wager is a decentralized betting platform that allows users to place bets on the outcomes of various events, starting with the 2023 Turkish General Elections. It leverages blockchain technology, smart contracts, and artificial intelligence to create a transparent and secure betting environment.",
  },
  {
    question: "How does Wiki Wager work?",
    answer:
      "Wiki Wager utilizes smart contracts on the Ethereum network to handle the betting functionality. Users can place bets on different candidates or outcomes. The betting results are fetched from Wikipedia articles and analyzed using the GPT-3.5 Turbo language model from OpenAI. The platform ensures fair gameplay, real-time updates, and secure transactions using blockchain technology.",
  },
  {
    question: "What technology does Wiki Wager use?",
    answer:
      "Wiki Wager leverages blockchain technology, specifically the Ethereum network, to create a decentralized and transparent betting platform. It also integrates with the Chainlink decentralized oracle network to fetch real-time betting results from Wikipedia. The platform utilizes the GPT-3.5 Turbo language model from OpenAI for analyzing and interpreting the data.",
  },
  {
    question: "Is Wiki Wager secure?",
    answer:
      "Yes, Wiki Wager prioritizes security and transparency. It uses smart contracts on the Ethereum network, which are immutable and tamper-proof. Transactions are securely recorded on the blockchain. Additionally, the integration with Chainlink ensures reliable and verified data from reputable sources like Wikipedia. User funds are managed through secure wallets, and the platform employs encryption techniques to protect crypto assets.",
  },
  {
    question: "How can I participate in Wiki Wager?",
    answer:
      "To participate in Wiki Wager, you can visit the Wiki Wager website and create an account. Once registered, you can explore the available betting events, select your preferred candidates or outcomes, and place your bets using the supported cryptocurrencies. Stay updated with real-time results and track your betting performance on the platform.",
  },
  {
    question: "What events can I bet on?",
    answer:
      "Initially, Wiki Wager focuses on the 2023 Turkish General Elections, allowing users to bet on the outcomes of this political event. However, the platform may expand to include betting opportunities on other events in the future.",
  },
  {
    question: "How are bets settled?",
    answer:
      "Bets on Wiki Wager are settled based on the results fetched from Wikipedia articles and analyzed using the GPT-3.5 Turbo language model. Once the results are confirmed, the winnings are distributed among the users who made correct predictions. The smart contracts handle the payout process automatically and transparently.",
  },
  {
    question: "Is there a fee to use Wiki Wager?",
    answer:
      "Yes, Wiki Wager charges a service fee percentage on the winnings. The exact fee percentage and details can be found in the platform's terms and conditions. The service fee is used to cover operational costs, ensure platform sustainability, and further develop the betting ecosystem.",
  },
  {
    question: "Can I withdraw my funds from Wiki Wager?",
    answer:
      "Yes, you can withdraw your funds from Wiki Wager. The platform allows users to withdraw their winnings and available balances. Withdrawals are processed securely and promptly, ensuring that you have full control over your funds.",
  },
  {
    question: "What happens if a bet is withdrawn?",
    answer:
      "If a bet is withdrawn before the betting event ends, the withdrawn amount is returned to the user's account balance. The withdrawn amount is no longer considered in the final settlement and distribution of winnings. The user can choose to place a new bet or withdraw the funds entirely from their account.",
  },
  {
    question: "How are winnings calculated?",
    answer:
      "Winnings on Wiki Wager are calculated based on the total amount bet on a candidate or outcome and the user's individual bet amount. The distribution of winnings follows a proportional model, where the total winnings pool is divided among the winning users based on their respective bet amounts.",
  },
  {
    question: "How can I contact Wiki Wager for support?",
    answer:
      "For support, you can check the Telegram channel at t.me/wikiwager or contact the Telegram bot @wikiwagerbot. Alternatively, you can also reach out to the team via email at a@wikiwager.xyz. The Wiki Wager team will be happy to assist you with any inquiries or issues you may have.",
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
