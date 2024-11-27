using Microsoft.AspNetCore.Mvc;

namespace quest_web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DefaultController : ControllerBase
    {
        [HttpGet]
        [Route("/testSuccess")]
        public IActionResult TestSuccess()
        {
            return Ok("success");
        }

        [HttpGet]
        [Route("/testNotFound")]
        public IActionResult TestNotFound()
        {
            return NotFound("not found");
        }

        [HttpGet]
        [Route("/testError")]
        public IActionResult TestError()
        {
            return StatusCode(500, "error");
        }
    }
}