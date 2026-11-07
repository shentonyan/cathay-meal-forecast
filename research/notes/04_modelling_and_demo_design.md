# Modelling Approach and Demo Design

> Research notes behind the [report](../../docs/research.html), one per research track. Hover over any source link to see the supporting quote from that source.

## 1. Recommended forecasting stack

**Two layers: first predict a demand distribution, then make the loading decision.**

- **Layer 1 (per-flight dish shares, GBM):** use LightGBM/XGBoost to regress each dish's share per flight. Features: route, departure time, cabin, block time, season, load factor, passenger nationality mix and historical leftovers. Academic work already uses ML to predict inflight food waste and notes that waste is driven by passenger choices, flight parameters and catering service together [DergiPark – ML to predict inflight food waste](https://dergipark.org.tr/en/download/article-file/4159755 "The study delves into the utilization of machine learning to predict and reduce inflight food waste, improving sustainability in aviation logistics."). The DGLR 2025 paper specifically studies how to predict on-board consumption when catering data is unavailable [DGLR – Prediction of On-Board Consumption](https://www.dglr.de/publikationen/2025/650481.pdf "This research paper focuses on overcoming the challenges posed by unavailability of in-flight catering data and enabling on-board consumption prediction.").
- **Passenger layer (discrete choice / multinomial logit):** for passengers with a member profile, use MNL to estimate P(choose A | attributes), then aggregate to a flight-level mean and variance and blend (ensemble) with the GBM output. The airline revenue-management literature also stresses that demand forecasts should explain the "why", not just extrapolate history [arXiv 2103.08405](http://arxiv.org/pdf/2103.08405v1 "Most, if not all, forecasting methods use historical data to forecast the future, disregarding the 'why'."). (Note: MNL here is a modelling recommendation, not a finding of that paper.)
- **Hierarchical / time-series models:** use a route → flight → cabin hierarchy with hierarchical reconciliation to handle cold-start routes. Pre-order counts over time can also be GBM features. (This is a method recommendation; no specific source was found.)
- **Layer 2 (load quantity, newsvendor):** the optimal load Q* satisfies P(D ≤ Q*) = Cu/(Cu+Co) [asgard newsvendor SKILL](https://github.com/asgard-ai-platform/skills/blob/main/algo-sc-newsvendor/SKILL.md "Optimal Q* satisfies: P(D ≤ Q*) = Cu / (Cu + Co). Known as the critical ratio solution."). In practice, take the quantile of the forecast demand distribution at the critical ratio [MetricGate – Critical Fractile](https://metricgate.com/docs/newsvendor-critical-fractile/ "the optimal order quantity is the demand quantile at that ratio."). The solution deliberately leans toward the cheaper error [MetricGate – Newsvendor in R](https://metricgate.com/blogs/newsvendor-single-period-stocking-r/ "It deliberately tilts the order quantity toward whichever error is cheaper to make"). In the demo, "first-choice availability ≥ 95%" can be the service-level constraint: take the 95% quantile for each dish, or run a joint Monte Carlo across dishes, and use a slider to show the trade-off between leftover rate and availability.

## 2. Datasets and synthetic data

- **DGLR synthetic-data approach:** because catering data is not public, generate synthetic data to train the consumption model [DGLR](https://www.dglr.de/publikationen/2025/650481.pdf "Generating Synthetic Data for Machine Learning to Optimize Catering Weight").
- **OpenSky Network:** offers real-time APIs, historical archives and research datasets, which can provide realistic schedules and sectors [OpenSky Data](https://dev.opensky-network.org/data "ranging from real-time APIs to historical archives and curated scientific datasets."). OpenSky can be combined with OpenFlights to analyse airlines and aircraft types [GitHub ETL](https://github.com/MichailParaskevopoulos/covid19-airtraffic-spark-bigquery "the OpenSky and OpenFlights datasets not only can be used to analyze trends in airtraffic during the COVID-19 pandemic, but also to explore patterns between different airlines and aircraft types.").
- **Proposed synthetic setup for the demo:** use HKG departures from OpenSky/OpenFlights as the skeleton, generate seat counts and load factors by aircraft type, and draw dish shares from a Dirichlet distribution by route × time of day × nationality mix. Use a pre-order rate of 2–5% (see section 4) and sample the remaining passengers with MNL. No public Kaggle inflight catering dataset was verified in this search.

## 3. KPIs and ROI calculation

- **Waste baseline:** IATA audited 25 flights from Singapore Changi; food and beverage made up 65% of cabin and catering waste, and untouched meals were 18% of all waste [Onboard Hospitality](https://www.onboardhospitality.com/meal-planning/ "F&B accounts for 65% of cabin and catering waste, with untouched meals accounting for 18% of all waste."). KLM's internal audits found 25–30% of sandwiches were not eaten [Wisevoter – KLM](https://wisevoter.com/world/2026/09/26/klm-updates-economy-class-service "internal audits showed that 25 to 30 percent of sandwiches served on flights were left uneaten.").
- **Cost of weight:** the traditional industry rule of thumb is 2.5–5% of the carried weight per flight hour [AircraftIT – Cost of Weight](https://www.aircraftit.com/articles/a-new-approach-to-cost-of-weight-cow/ "the historical value of the cost of weight which is between 2.5 % and 5% per flight hour."). A study of added weight on narrow-body aircraft gives a unit cost of about $0.021–$0.024 [Forthcode](https://www.forthcode.com/resources/Narrow_Body_Incremental_Weight_Research_Paper-preview.pdf "$0.021 - $0.024") (the unit needs checking against the original). Suggested calculation: extra fuel (kg) ≈ weight removed (kg) × 0.03 × flight hours; CO₂ = fuel × 3.16 (3.16 is a standard emissions factor, not separately sourced here).
- **KPI formulas:**
  - Over-catering rate = (meals loaded − meals consumed) / meals loaded
  - Waste weight (kg) = leftover meals × weight per meal
  - Cost per meal = total catering cost / meals consumed
  - First-choice availability = passengers who got their first choice / total passengers
  - ROI = (meal costs avoided + fuel saved + disposal fees saved + pre-order revenue − incentive costs) / system cost

## 4. Pre-order incentives and behavioural nudges

- **Low uptake:** the industry believes fewer than 5% of passengers pre-order inflight meals, and some put it as low as 2% [Onboard Hospitality](https://www.onboardhospitality.com/meal-planning/ "the percentage of air passengers who pre-order their inflight meals is believed to be less than 5%. Some believe the figure is as low as 2%."). The benefit to airlines is that inventory is not needlessly packed, loaded and flown around [Onboard Hospitality](https://www.onboardhospitality.com/meal-planning/ "It stops inventory being needlessly packed, loaded and flown from destination to destination at great cost and with no revenue generation").
- **KLM:** from 25 October 2026, passengers on flights longer than 75 minutes can pre-order meals through My Trip [Wisevoter – KLM](https://wisevoter.com/world/2026/09/26/klm-updates-economy-class-service "Passengers can pre-order meals for flights exceeding 75 minutes through the My Trip booking platform."). KLM special meals must be ordered at least 24 hours before departure [KLM](https://www.klm.com/information/travel-class-extra-options/dietary-meals "Order your meal at least 24 hours before departure, and we'll have it ready on board.").
- **Finnair thesis:** pre-paid hot meals in long-haul Economy are seen as a way to improve the experience, cut waste and earn revenue at the same time [Theseus – Finnair thesis](https://www.theseus.fi/bitstream/handle/10024/905181/Karlson_Tomi.pdf?isAllowed=y&sequence=2 "Pre-ordered and pre-paid meals have emerged as a strategic opportunity to enhance cus-tomer experience, reduce food waste, and generate additional revenue for airlines.").
- **Design ideas (unproven; treat as A/B-test hypotheses in the demo):**
  - Reward meal pre-selection with Asia Miles (for example 50–100 miles).
  - Give a bigger reward for choosing "no meal", and show the passenger the CO₂ saved.
  - Make pre-selection a default step at check-in or in app notifications.
  - Show a "popular dish may sell out" prompt.

## Summary

1. **Stack:** GBM forecasts dish shares (optionally blended with an MNL passenger-choice model) → demand distribution → newsvendor critical quantile (or a 95% first-choice availability constraint) sets the load.
2. **Data:** public catering data is scarce. Follow the DGLR synthetic-data approach, using OpenSky/OpenFlights flights as the skeleton for demo data.
3. **Key ROI parameters:** untouched meals are about 18% of waste; cost of weight is about 2.5–5% per flight hour.
4. **Pre-order uptake:** the baseline is only 2–5%, so incentives (miles rewards, defaults, a no-meal option) are the core lever.
