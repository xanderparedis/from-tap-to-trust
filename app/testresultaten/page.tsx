import type { Metadata } from "next";
import { Intro } from "../_components/content";
import { MediaPlaceholder } from "../_components/media-placeholder";
import { ChlorineDemo } from "./test-tools";
import { LeadCheck } from "./lead-check";
import { TestRoutes } from "./test-routes";

export const metadata: Metadata = { title: "My tests and results" };

export default function TestsPage() {
  return (
    <>
      <Intro section={"Your personal space"} title={"My tests and results"}>
        <p>{"Choose your test. See what you can do, step by step."}</p>
      </Intro>
      <TestRoutes
        chlorine={(
          <section className="test-section section-space" id="chloor" aria-labelledby="chlorine-title">
            <div className="section-heading">
              <div>
                <h2 id="chlorine-title">{"Chlorine"}</h2>
                <p>{"Compare the measurement with what you smell, taste or find bothersome."}</p>
              </div>
            </div>
            <div className="feature-grid test-grid">
              <ChlorineDemo />
              <div className="panel test-guide">
                <MediaPlaceholder label={"Cuvette with DPD and a colour chart"} />
                <details className="test-details">
                  <summary>{"How does the chlorine test work?"}</summary>
                  <ol className="test-steps">
                    <li>{"Take a fresh water sample."}</li>
                    <li>{"Measure free chlorine with DPD1 and total chlorine with DPD3, following the test kit instructions."}</li>
                    <li>{"Calculate the difference and record what you smell, taste and whether it bothers you."}</li>
                  </ol>
                </details>
                <details className="test-details" id="chloor-tips" name="chlorine-guide">
                  <summary>{"Grandma’s tricks · taste comparison"}</summary>
                  <p>{"If your tap water is suitable for drinking and you want to compare its taste, try it at room temperature and chilled from a clean jug."}</p>
                </details>
                <details className="test-details" name="chlorine-guide">
                  <summary>{"What if I notice a change?"}</summary>
                  <p>{"If you notice a sudden or persistent change in taste, smell or colour, ask your water company for advice."}</p>
                </details>
              </div>
            </div>
          </section>
        )}
        lead={(
          <section className="test-section section-space" id="lood" aria-labelledby="lead-title">
            <div className="section-heading">
              <div>
                <h2 id="lead-title">{"Lead"}</h2>
                <p>{"Complete the lead self-check in five questions."}</p>
              </div>
            </div>
            <div className="feature-grid test-grid">
              <LeadCheck />
              <div className="panel test-guide">
                <MediaPlaceholder label={"Water meter with a visible pipe and connection"} />
                <details className="test-details" name="lead-guide">
                  <summary>{"What should I look for?"}</summary>
                  <p>{"Look at accessible pipes near the water meter. A grey pipe that is not magnetic, with bulges at the joints, may indicate lead. Many pipes are hidden behind walls or under the floor."}</p>
                </details>
                <details className="test-details" name="lead-guide">
                  <summary>{"How does a professional test work?"}</summary>
                  <p>{"Ask your water company who can take the sample. The sampler will agree where and how it will be taken. Discuss what the result means for the tap tested and which next step suits your plumbing."}</p>
                </details>
              </div>
            </div>
          </section>
        )}
      />
    </>
  );
}
