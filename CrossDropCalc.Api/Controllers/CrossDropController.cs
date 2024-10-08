using CrossDropCalc.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CrossDropCalc.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CrossDropController(ICrossDropService crossDropService) : Controller
    {
        [HttpPost]
        public string Get(int beforeCrossDropGallons, double originalOctane, int gallonsCrossDropped, double crossDropOctane, int tankCapacity, double octaneThreshold)
            => crossDropService.GetBlendedOctane(beforeCrossDropGallons, originalOctane, gallonsCrossDropped, crossDropOctane, tankCapacity, octaneThreshold);
    }
}
