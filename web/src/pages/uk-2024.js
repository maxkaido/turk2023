import Head from "next/head";

const ElectionBettingPage = () => {
  return (
    <div>
      <Head>
        <title>UK 2024 Election Betting</title>
      </Head>
      <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">UK 2024 Election Betting</h1>
          <div className="bg-white bg-opacity-20 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Potential Betting Outcomes
            </h2>
            <ol className="list-decimal list-inside">
              <li className="mb-4">
                <strong>Party to Win the Most Seats:</strong> The Conservative
                Party and the Labour Party are traditionally the two main
                parties in UK politics. As of the last update, the Conservatives
                hold 354 seats and Labour holds 197. However, public opinion can
                shift significantly in the lead-up to an election, and it`s
                possible that Labour could make substantial gains. Therefore, a
                bet could be placed on which of these two parties will win the
                most seats in the election.
              </li>
              <li className="mb-4">
                <strong>Next Prime Minister:</strong> The current Prime Minister
                is Rishi Sunak from the Conservative Party, and the leader of
                the Labour Party is Keir Starmer. A bet could be placed on who
                will be the Prime Minister after the election - either Rishi
                Sunak retains his position, or Keir Starmer becomes the new
                Prime Minister.
              </li>
              <li className="mb-4">
                <strong>Scottish Independence Referendum Outcome:</strong> The
                SNP leader, Nicola Sturgeon, has announced her intention to
                treat the next general election as a de facto independence
                referendum. Therefore, a bet could be placed on whether the
                majority of Scottish constituencies will vote for SNP (implying
                a desire for independence) or not.
              </li>
              <li className="mb-4">
                <strong>Number of Seats for Smaller Parties:</strong> Smaller
                parties like the SNP, Liberal Democrats, DUP, Sinn Féin, and
                others also play a significant role in UK politics. A bet could
                be placed on whether the total number of seats won by these
                smaller parties will be above or below a certain threshold.
              </li>
              <li className="mb-4">
                <strong>MPs Not Standing for Re-Election:</strong> As of 8 June
                2023, a total of 59 Members of Parliament have announced their
                intention to not stand for re-election. A bet could be placed on
                whether the final number of MPs not standing for re-election
                will be above or below a certain number.
              </li>
            </ol>
            <p className="text-sm text-gray-300 mt-4">
              Please note that these are hypothetical scenarios and the actual
              odds would depend on a variety of factors, including current
              political climate, public opinion, and specific events leading up
              to the election.
            </p>
            <p className="text-sm text-gray-300 mt-4">
              For more information on UK politics and the upcoming election, you
              can visit the{" "}
              <a
                href="https://en.wikipedia.org/wiki/United_Kingdom_general_election,_2024"
                className="text-white underline hover:text-gray-200"
              >
                Wikipedia article about the upcoming UK 2024 general elections
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionBettingPage;
