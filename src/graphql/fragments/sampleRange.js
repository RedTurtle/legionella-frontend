import gql from 'graphql-tag';
import reportFragments from './report';

const sampleRangeDetails = gql`
  fragment SampleRangeDetails on SampleRange {
    id
    description
    title
    company
    datesList
    filterOn
    finalBlock
    managerBlock
    tecnicoBlock
    freezeDate
  }
`;

const sampleRangeFragments = {
  sampleRangeDetails,
  sampleRangeInfos: gql`
    fragment SampleRangeInfos on SampleRange {
      ...SampleRangeDetails
      structureAggregatedSamples {
        structureId
        structureGlobalId
        structureLabel
        structureType
        wspsPercentage
        samplesNumCold
        samplesNumHot
        ...SampleReportOverlay
        aggregatedLegionellaHot {
          perfect
          good
          bad
          danger
          critical
        }
        aggregatedLegionellaCold {
          perfect
          good
          bad
          danger
          critical
        }
        aggregatedBioxHot {
          perfect
          good
          bad
          danger
          critical
        }
        aggregatedBioxCold {
          perfect
          good
          bad
          danger
          critical
        }
        aggregatedTemps {
          coldTemperature {
            perfect
            good
            bad
            danger
            critical
          }
          coldFlowTemperature {
            perfect
            good
            bad
            danger
            critical
          }
          hotTemperature {
            perfect
            good
            bad
            danger
            critical
          }
          hotFlowTemperature {
            perfect
            good
            bad
            danger
            critical
          }
        }
      }
    }
    ${sampleRangeDetails}
    ${reportFragments.sampleReportOverlay}
  `,
};

export default sampleRangeFragments;
