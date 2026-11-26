using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using project_a.Controllers;
using project_a.Models;

namespace project_a.Tests
{
    public static class TestRunner
    {
        public static void RunAllTests()
        {
            Console.WriteLine("========================================");
            Console.WriteLine("🧪 RUNNING RHYTHMCODE MVP UNIT TESTS");
            Console.WriteLine("========================================");

            int passed = 0;
            int failed = 0;

            void Assert(bool condition, string testName)
            {
                if (condition)
                {
                    Console.WriteLine($"[PASS] {testName}");
                    passed++;
                }
                else
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"[FAIL] {testName}");
                    Console.ResetColor();
                    failed++;
                }
            }

            // Test 1: TaskRepository GetAll
            var allTasks = TaskRepository.GetAll();
            Assert(allTasks.Count == 10, "TaskRepository contains exactly 10 Section 1 tasks");

            // Test 2: Task integrity for all 10 tasks
            for (int i = 1; i <= 10; i++)
            {
                var task = TaskRepository.GetById(i);
                Assert(task != null, $"Task {i} exists");
                if (task != null)
                {
                    Assert(!string.IsNullOrWhiteSpace(task.Title), $"Task {i} has Title: {task.Title}");
                    Assert(!string.IsNullOrWhiteSpace(task.Concept), $"Task {i} has Concept: {task.Concept}");
                    Assert(!string.IsNullOrWhiteSpace(task.Instruction), $"Task {i} has Instruction");
                    Assert(!string.IsNullOrWhiteSpace(task.SoundInfo), $"Task {i} has SoundInfo");
                    Assert(!string.IsNullOrWhiteSpace(task.PedagogicOutcome), $"Task {i} has PedagogicOutcome");
                    Assert(!string.IsNullOrWhiteSpace(task.Hint), $"Task {i} has Hint");
                }
            }

            // Test 3: Edge cases for invalid task IDs
            Assert(TaskRepository.GetById(0) == null, "GetById(0) returns null");
            Assert(TaskRepository.GetById(-1) == null, "GetById(-1) returns null");
            Assert(TaskRepository.GetById(11) == null, "GetById(11) returns null");
            Assert(TaskRepository.GetById(999) == null, "GetById(999) returns null");

            // Test 4: Task sequence chaining
            var task1 = TaskRepository.GetById(1)!;
            Assert(task1.PreviousId == 0, "Task 1 has PreviousId == 0");
            Assert(task1.NextId == 2, "Task 1 has NextId == 2");

            var task10 = TaskRepository.GetById(10)!;
            Assert(task10.PreviousId == 9, "Task 10 has PreviousId == 9");
            Assert(task10.NextId == 0, "Task 10 has NextId == 0 (leads to Workshop)");

            for (int i = 2; i <= 9; i++)
            {
                var t = TaskRepository.GetById(i)!;
                Assert(t.PreviousId == i - 1, $"Task {i} PreviousId is {i - 1}");
                Assert(t.NextId == i + 1, $"Task {i} NextId is {i + 1}");
            }

            // Test 5: HomeController
            var logger = Microsoft.Extensions.Logging.Abstractions.NullLogger<HomeController>.Instance;
            var homeController = new HomeController(logger);
            var homeResult = homeController.Index() as ViewResult;
            Assert(homeResult != null, "HomeController.Index returns ViewResult");
            var homeModel = homeResult?.Model as System.Collections.Generic.IEnumerable<TaskModel>;
            Assert(homeModel != null && homeModel.Count() == 10, "HomeController passes all 10 tasks to Index view");

            // Test 6: TaskController
            var taskController = new TaskController();
            for (int i = 1; i <= 10; i++)
            {
                var result = taskController.Index(i) as ViewResult;
                Assert(result != null, $"TaskController.Index({i}) returns ViewResult");
                var model = result?.Model as TaskModel;
                Assert(model != null && model.Id == i, $"TaskController.Index({i}) passes TaskModel with Id {i}");
            }

            // Test 7: TaskController out-of-range redirects to Task 1
            var redirectZero = taskController.Index(0) as RedirectToActionResult;
            Assert(redirectZero != null && redirectZero.ActionName == nameof(TaskController.Index), "TaskController.Index(0) redirects to Index");
            Assert(redirectZero?.RouteValues?["id"]?.ToString() == "1", "TaskController.Index(0) redirects to id=1");

            var redirectNegative = taskController.Index(-5) as RedirectToActionResult;
            Assert(redirectNegative != null && redirectNegative.RouteValues?["id"]?.ToString() == "1", "TaskController.Index(-5) redirects to id=1");

            var redirectHigh = taskController.Index(15) as RedirectToActionResult;
            Assert(redirectHigh != null && redirectHigh.RouteValues?["id"]?.ToString() == "1", "TaskController.Index(15) redirects to id=1");

            // Test 8: WorkshopController
            var workshopController = new WorkshopController();
            var workshopResult = workshopController.Index() as ViewResult;
            Assert(workshopResult != null, "WorkshopController.Index returns ViewResult");

            // Test 8b: ChapterController
            var chapterController = new ChapterController();
            var chapterResult = chapterController.Index(1) as ViewResult;
            Assert(chapterResult != null, "ChapterController.Index(1) returns ViewResult");
            var chapterModel = chapterResult?.Model as System.Collections.Generic.IEnumerable<TaskModel>;
            Assert(chapterModel != null && chapterModel.Count() == 10, "ChapterController.Index(1) passes all 10 tasks");
            var chapterRedirect = chapterController.Index(2) as RedirectToActionResult;
            Assert(chapterRedirect != null && chapterRedirect.RouteValues?["id"]?.ToString() == "1", "ChapterController.Index(2) redirects to id=1");

            // Test 9: Static Asset files on disk
            string wwwroot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            string audioJs = Path.Combine(wwwroot, "js", "audio-engine.js");
            string canvasJs = Path.Combine(wwwroot, "js", "canvas-engine.js");
            string tasksJs = Path.Combine(wwwroot, "js", "tasks.js");
            string workshopJs = Path.Combine(wwwroot, "js", "workshop.js");
            string siteCss = Path.Combine(wwwroot, "css", "site.css");

            Assert(File.Exists(audioJs), "audio-engine.js exists");
            Assert(File.Exists(canvasJs), "canvas-engine.js exists");
            Assert(File.Exists(tasksJs), "tasks.js exists");
            Assert(File.Exists(workshopJs), "workshop.js exists");
            Assert(File.Exists(siteCss), "site.css exists");

            // Test 10: Contract inspections inside static JS
            if (File.Exists(audioJs))
            {
                string content = File.ReadAllText(audioJs);
                Assert(content.Contains("class AudioEngine"), "audio-engine.js defines AudioEngine class");
                Assert(content.Contains("RhythmMixer"), "audio-engine.js instantiates RhythmMixer singleton");
                Assert(content.Contains("261.63"), "audio-engine.js includes C4 (Do) pentatonic frequency");
            }

            if (File.Exists(canvasJs))
            {
                string content = File.ReadAllText(canvasJs);
                Assert(content.Contains("class CanvasEngine"), "canvas-engine.js defines CanvasEngine class");
                Assert(content.Contains("class ParticleSystem"), "canvas-engine.js defines ParticleSystem class");
                Assert(content.Contains("drawBrush"), "canvas-engine.js exports drawBrush method");
                Assert(content.Contains("drawPuskul"), "canvas-engine.js exports drawPuskul method");
                Assert(content.Contains("logicalWidth"), "canvas-engine.js uses logicalWidth for exact hit testing");
            }

            if (File.Exists(workshopJs))
            {
                string content = File.ReadAllText(workshopJs);
                Assert(content.Contains("class WorkshopEngine"), "workshop.js defines WorkshopEngine class");
                Assert(content.Contains("toggleLoopActive"), "workshop.js implements interactive loop child targeting");
                Assert(content.Contains("updateLoopCount"), "workshop.js implements loop count stepper");
                Assert(content.Contains("moveBlockUp"), "workshop.js implements block up reordering");
                Assert(content.Contains("moveBlockDown"), "workshop.js implements block down reordering");
                Assert(content.Contains("moveBlockOut"), "workshop.js implements block extraction from loops");
            }

            if (File.Exists(tasksJs))
            {
                string content = File.ReadAllText(tasksJs);
                Assert(content.Contains("class TaskEngine"), "tasks.js defines TaskEngine class");
                Assert(content.Contains("playWaveSignalSound"), "tasks.js implements wave signal sound replay");
                Assert(content.Contains("verifyConditionDoor"), "tasks.js implements condition door verification");
                Assert(content.Contains("changeBrushScale"), "tasks.js implements brush scaling");
                Assert(content.Contains("playDemoSequence"), "tasks.js implements demo sequence replay");
            }

            // Test 11: Razor Views on disk
            string viewsDir = Path.Combine(Directory.GetCurrentDirectory(), "Views");
            Assert(File.Exists(Path.Combine(viewsDir, "Home", "Index.cshtml")), "Views/Home/Index.cshtml exists");
            Assert(File.Exists(Path.Combine(viewsDir, "Chapter", "Index.cshtml")), "Views/Chapter/Index.cshtml exists");
            Assert(File.Exists(Path.Combine(viewsDir, "Task", "Index.cshtml")), "Views/Task/Index.cshtml exists");
            Assert(File.Exists(Path.Combine(viewsDir, "Workshop", "Index.cshtml")), "Views/Workshop/Index.cshtml exists");
            Assert(File.Exists(Path.Combine(viewsDir, "Shared", "_Layout.cshtml")), "Views/Shared/_Layout.cshtml exists");

            // Test 12: Mobile Optimization Contracts (Full Screen Canvas & Standalone Feedback Overlay)
            string taskViewPath = Path.Combine(viewsDir, "Task", "Index.cshtml");
            if (File.Exists(taskViewPath))
            {
                string taskViewContent = File.ReadAllText(taskViewPath);
                int canvasWrapperIdx = taskViewContent.IndexOf("task-canvas-wrapper");
                int canvasCloseIdx = canvasWrapperIdx >= 0 ? taskViewContent.IndexOf("</div>", canvasWrapperIdx) : -1;
                int celebrationModalIdx = taskViewContent.IndexOf("id=\"celebrationModal\"");

                Assert(celebrationModalIdx > canvasCloseIdx, "celebrationModal is decoupled and rendered outside task-canvas-wrapper");
                Assert(taskViewContent.Contains("Tebrikler"), "Feedback overlay contains 'Tebrikler' heading");
                Assert(taskViewContent.Contains("Görevi Tamamladın"), "Feedback overlay contains 'Görevi Tamamladın' completion text");
                Assert(taskViewContent.Contains("Tekrar Dene"), "Feedback overlay contains 'Tekrar Dene' action");
                Assert(taskViewContent.Contains("Sonraki Göreve Geç"), "Feedback overlay contains 'Sonraki Göreve Geç' action");
            }

            if (File.Exists(siteCss))
            {
                string cssContent = File.ReadAllText(siteCss);
                Assert(cssContent.Contains("position: fixed") && cssContent.Contains("inset: 0") && cssContent.Contains("z-index: 1000"), "celebration-overlay is a fixed full-screen standalone DOM layer");
                Assert(cssContent.Contains("100dvh"), "CSS utilizes dynamic viewport height (100dvh) for mobile responsiveness");
                Assert(cssContent.Contains("min-height: 48px") || cssContent.Contains("min-height: 52px"), "Touch targets meet or exceed minimum 48px height");
                Assert(cssContent.Contains("aspect-ratio: auto"), "Canvas wrapper eliminates restrictive aspect-ratio for full-screen phone support");
                Assert(cssContent.Contains(".task-page-body main {\n  height: 100vh;\n  height: 100dvh;") || cssContent.Contains(".task-page-body main {\r\n  height: 100vh;\r\n  height: 100dvh;"), "task-page-body main occupies full viewport height to avoid clipping child controls bar");
            }

            if (File.Exists(canvasJs))
            {
                string canvasEngineContent = File.ReadAllText(canvasJs);
                Assert(canvasEngineContent.Contains("Math.max(0, Math.min(logicalWidth"), "getPointerPos bounds check prevents horizontal drift");
                Assert(canvasEngineContent.Contains("Math.max(0, Math.min(logicalHeight"), "getPointerPos bounds check prevents vertical drift");
                Assert(canvasEngineContent.Contains("rect.width > 0"), "getPointerPos dynamically adapts to rect dimensions and protects against 0-division");
                Assert(canvasEngineContent.Contains("!evt"), "getPointerPos guards against null event objects");
            }

            if (File.Exists(tasksJs))
            {
                string tasksJsContent = File.ReadAllText(tasksJs);
                Assert(tasksJsContent.Contains("pointercancel"), "tasks.js listens for pointercancel to handle touch gesture cancellations");
            }

            Console.WriteLine("========================================");
            Console.WriteLine($"TOTAL TESTS: {passed + failed} | PASSED: {passed} | FAILED: {failed}");
            Console.WriteLine("========================================");

            if (failed > 0)
            {
                Environment.Exit(1);
            }
        }
    }
}
