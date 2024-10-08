namespace CrossDropCalc.Api.Services.Interfaces
{
    public interface ICrossDropService
    {
        string GetBlendedOctane(int beforeGallons, double beforeOctane, int afterCrossDropGallons, double crossDropOctane, int tankCapacity, double octaneThreshold);
    }
}
