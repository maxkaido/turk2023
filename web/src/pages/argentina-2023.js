import Head from "next/head";

export default function Argentina2023() {
  return (
    <div className="font-sans text-gray-900 antialiased">
      <Head>
        <title>Argentina 2023 Election Betting Outcomes</title>
      </Head>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Argentina 2023 Election Betting Outcomes
          </h1>

          <div className="mt-8">
            <div className="mt-6 grid gap-16 border-t-2 border-gray-100 pt-10 lg:grid-cols-1">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Party to Win the Presidential Election
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  This bet would be on which party's candidate will win the
                  presidency. The main contenders seem to be the Frente de Todos
                  (FdT) and Juntos por el Cambio (JxC).
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Top Two Candidates in the First Round
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  This bet would be on which two candidates will receive the
                  most votes in the first round and thus proceed to the
                  potential second round. The main contenders seem to be Agustín
                  Rossi (FdT), Horacio Rodríguez Larreta (JxC), Patricia
                  Bullrich (JxC), and Gerardo Morales (JxC).
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Presidential Election to Go to Second Round
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  This bet would be on whether the presidential election will go
                  to a second round. According to the Argentine electoral
                  system, a candidate can win the presidency in a single round
                  by either winning 45% of the vote, or if they win 40% of the
                  vote while finishing 10 percentage points ahead of the
                  second-place candidate. If no candidate meets either
                  threshold, a runoff takes place between the top two
                  candidates.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Party to Win Majority in the Chamber of Deputies
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  This bet would be on which party will win the majority of the
                  130 seats up for renewal in the Chamber of Deputies.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Party to Win Majority in the Senate
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  This bet would be on which party will win the majority of the
                  Senate seats up for renewal in the provinces of Buenos Aires,
                  Formosa, Jujuy, La Rioja, Misiones, San Juan, San Luis, and
                  Santa Cruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
