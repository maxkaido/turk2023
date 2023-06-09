import Head from "next/head";

const Usa2024ElectionBettingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500">
      <Head>
        <title>USA 2024 Election Betting</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.15/dist/tailwind.min.css"
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          2024 United States Presidential Election Betting
        </h1>

        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Betting Outcomes:
          </h2>

          <ol className="list-decimal pl-6 text-white">
            <li className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Party of the Winning Candidate:
              </h3>
              <p>
                This is a straightforward bet on whether the Democratic Party
                (represented by incumbent President Joe Biden) or the Republican
                Party (represented by former President Donald Trump) will win
                the election. Given the historical competitiveness of U.S.
                presidential elections, this could be seen as a roughly 50/50
                proposition.
              </p>
            </li>
            <li className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Popular Vote Margin:
              </h3>
              <p>
                A bet could be placed on the margin of the popular vote. For
                instance, the bet could be whether the winning candidate will
                win the popular vote by a margin of more than 2%. Given the
                polarized nature of U.S. politics, this could also be seen as a
                roughly 50/50 proposition.
              </p>
            </li>
            <li className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Number of Swing States Won:
              </h3>
              <p>
                A bet could be placed on the number of key swing states (such as
                Wisconsin, Michigan, Pennsylvania, Nevada, Arizona, and Georgia)
                that the winning candidate will carry. The bet could be whether
                the winning candidate will win more than half of these key swing
                states.
              </p>
            </li>
            <li className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Key Issues Influence:
              </h3>
              <p>
                A bet could be placed on which key issue (such as crime,
                immigration, gun control, healthcare, abortion access, LGBT
                rights, the state of the economy, and democratic backsliding)
                will be the most influential in determining the outcome of the
                election, based on post-election surveys.
              </p>
            </li>
            <li>
              <h3 className="text-lg font-semibold text-white mb-2">
                Rematch Outcome:
              </h3>
              <p>
                Given that this election could be a rematch of the 2020 election
                (Biden vs. Trump), a bet could be placed on whether the outcome
                will be the same as in 2020 (Biden wins) or different (Trump
                wins).
              </p>
            </li>
          </ol>

          <p className="text-white mt-8">
            Please note that these are hypothetical betting outcomes and are not
            intended to encourage gambling. They are merely intended to
            illustrate potential outcomes based on the information available
            about the 2024 U.S. presidential election.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Usa2024ElectionBettingPage;
