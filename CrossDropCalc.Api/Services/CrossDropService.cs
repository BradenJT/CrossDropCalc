using CrossDropCalc.Api.Services.Interfaces;

namespace CrossDropCalc.Api.Services
{
    public class CrossDropService : ICrossDropService
    {
        public string GetBlendedOctane(int beforeGallons, double beforeOctane, int afterCrossDropGallons, double crossDropOctane, int tankCapacity, double octaneThreshold)
        {
            var blendedOctane = ((beforeGallons * beforeOctane) + (afterCrossDropGallons * crossDropOctane)) / (afterCrossDropGallons + beforeGallons);
            if (blendedOctane < (beforeOctane - octaneThreshold))
            {
                return CaclulateOctaneCorrection((beforeGallons + afterCrossDropGallons), beforeOctane, blendedOctane, tankCapacity, octaneThreshold);
            }
            return $"Blended Octane Is: {blendedOctane}, no Correction Needed.";
        }

        private string CaclulateOctaneCorrection(int gallonsInGround, double octaneBroughtIn, double blendedOctane, int tankCapacity, double octaneThreshold)
        {
            int maxGallonsToBring = tankCapacity - gallonsInGround - 500;
            int additionalGallonsBrought = 0;
            int totalGallonsPumpedOut = 0;
            double correctedOctane = blendedOctane;
            bool isBringingIn = true;
            int gallonsInGroundAfterPumpout = gallonsInGround;

            while (correctedOctane < octaneBroughtIn - octaneThreshold)
            {
                if (isBringingIn && additionalGallonsBrought < maxGallonsToBring)
                {
                    additionalGallonsBrought += 500;
                    gallonsInGround += 500;
                }
                else if (!isBringingIn)
                {
                    totalGallonsPumpedOut += 500;
                    gallonsInGround -= 500;
                    gallonsInGroundAfterPumpout -= 500;
                    maxGallonsToBring += 500;
                }

                correctedOctane = Math.Round(((gallonsInGroundAfterPumpout * blendedOctane) + (additionalGallonsBrought * octaneBroughtIn)) / (additionalGallonsBrought + gallonsInGroundAfterPumpout), 1);

                if (correctedOctane >= octaneBroughtIn - octaneThreshold)
                {
                    break;
                }

                if (additionalGallonsBrought >= maxGallonsToBring)
                {
                    isBringingIn = false;
                }
                else
                {
                    isBringingIn = true;
                }
            }
            return $"Current Blended Octane Is: {Math.Round((blendedOctane), 1)}\nTo Correct Octane:\n{additionalGallonsBrought} Gallons of {octaneBroughtIn} Octane Need to be Brought In.\n{totalGallonsPumpedOut} Gallons Need to be Pumped Out.\nCorrected Octane will be: {correctedOctane}";
        }
    }
}
