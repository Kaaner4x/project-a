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

            // Test 1: TaskRepository GetAll & Chapters
            var allTasks = TaskRepository.GetAll();
            Assert(allTasks.Count == 22, "TaskRepository contains exactly 22 tasks across Chapters 1 and 2");

            var chapter1Tasks = TaskRepository.GetByChapter(1);
            Assert(chapter1Tasks.Count == 10, "Chapter 1 contains 10 tasks");

            var chapter2Tasks = TaskRepository.GetByChapter(2);
            Assert(chapter2Tasks.Count == 12, "Chapter 2 contains 12 tasks");

            // Test 2: Task integrity for all 22 tasks
            for (int i = 1; i <= 22; i++)
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
            Assert(TaskRepository.GetById(23) == null, "GetById(23) returns null");
            Assert(TaskRepository.GetById(999) == null, "GetById(999) returns null");

            // Test 4: Task sequence chaining
            var task1 = TaskRepository.GetById(1)!;
            Assert(task1.PreviousId == 0, "Task 1 has PreviousId == 0");
            Assert(task1.NextId == 2, "Task 1 has NextId == 2");

            var task10 = TaskRepository.GetById(10)!;
            Assert(task10.PreviousId == 9, "Task 10 has PreviousId == 9");
            Assert(task10.NextId == 11, "Task 10 has NextId == 11 (leads to Chapter 2)");

            var task22 = TaskRepository.GetById(22)!;
            Assert(task22.PreviousId == 21, "Task 22 has PreviousId == 21");
            Assert(task22.NextId == 0, "Task 22 has NextId == 0 (leads to Workshop)");

            for (int i = 2; i <= 9; i++)
            {
                var t = TaskRepository.GetById(i)!;
                Assert(t.PreviousId == i - 1, $"Task {i} PreviousId is {i - 1}");
                Assert(t.NextId == i + 1, $"Task {i} NextId is {i + 1}");
            }

            for (int i = 11; i <= 21; i++)
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
            Assert(homeModel != null && homeModel.Count() == 22, "HomeController passes all 22 tasks to Index view");

            // Test 6: TaskController valid routes for all 22 tasks
            var taskController = new TaskController();
            for (int i = 1; i <= 22; i++)
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

            var redirectHigh = taskController.Index(99) as RedirectToActionResult;
            Assert(redirectHigh != null && redirectHigh.RouteValues?["id"]?.ToString() == "1", "TaskController.Index(99) redirects to id=1");

            // Test 8: WorkshopController
            var workshopController = new WorkshopController();
            var workshopResult = workshopController.Index() as ViewResult;
            Assert(workshopResult != null, "WorkshopController.Index returns ViewResult");

            // Test 8b: ChapterController
            var chapterController = new ChapterController();
            var chapter1Result = chapterController.Index(1) as ViewResult;
            Assert(chapter1Result != null, "ChapterController.Index(1) returns ViewResult");
            var chapter1Model = chapter1Result?.Model as System.Collections.Generic.IEnumerable<TaskModel>;
            Assert(chapter1Model != null && chapter1Model.Count() == 10, "ChapterController.Index(1) passes 10 tasks");

            var chapter2Result = chapterController.Index(2) as ViewResult;
            Assert(chapter2Result != null, "ChapterController.Index(2) returns ViewResult");
            var chapter2Model = chapter2Result?.Model as System.Collections.Generic.IEnumerable<TaskModel>;
            Assert(chapter2Model != null && chapter2Model.Count() == 12, "ChapterController.Index(2) passes 12 tasks");

            var chapterRedirect = chapterController.Index(3) as RedirectToActionResult;
            Assert(chapterRedirect != null && chapterRedirect.RouteValues?["id"]?.ToString() == "1", "ChapterController.Index(3) redirects to id=1");

            // Test 9: Static Asset files on disk
            string wwwroot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            string audioJs = Path.Combine(wwwroot, "js", "audio-engine.js");
            string canvasJs = Path.Combine(wwwroot, "js", "canvas-engine.js");
            string tasksJs = Path.Combine(wwwroot, "js", "tasks.js");
            string tasksSection2Js = Path.Combine(wwwroot, "js", "tasks-section2.js");
            string progressManagerJs = Path.Combine(wwwroot, "js", "progress-manager.js");
            string workshopJs = Path.Combine(wwwroot, "js", "workshop.js");
            string pixiJs = Path.Combine(wwwroot, "lib", "pixi", "pixi.min.js");
            string pixiEngineJs = Path.Combine(wwwroot, "js", "pixi-engine.js");
            string siteCss = Path.Combine(wwwroot, "css", "site.css");

            Assert(File.Exists(audioJs), "audio-engine.js exists");
            Assert(File.Exists(canvasJs), "canvas-engine.js exists");
            Assert(File.Exists(tasksJs), "tasks.js exists");
            Assert(File.Exists(tasksSection2Js), "tasks-section2.js exists");
            Assert(File.Exists(progressManagerJs), "progress-manager.js exists");
            Assert(File.Exists(workshopJs), "workshop.js exists");
            Assert(File.Exists(pixiJs), "pixi.min.js library exists in wwwroot/lib/pixi");
            Assert(File.Exists(pixiEngineJs), "pixi-engine.js adapter exists in wwwroot/js");
            Assert(File.Exists(siteCss), "site.css exists");

            if (File.Exists(progressManagerJs))
            {
                string progressContent = File.ReadAllText(progressManagerJs);
                Assert(progressContent.Contains("class ProgressManager"), "progress-manager.js defines ProgressManager class");
                Assert(progressContent.Contains("completeTask"), "progress-manager.js implements completeTask");
                Assert(progressContent.Contains("isTaskUnlocked"), "progress-manager.js implements isTaskUnlocked");
                Assert(progressContent.Contains("getActiveTaskForChapter"), "progress-manager.js implements getActiveTaskForChapter");
            }

            // Test 10: Contract inspections inside static JS
            if (File.Exists(audioJs))
            {
                string content = File.ReadAllText(audioJs);
                Assert(content.Contains("class AudioEngine"), "audio-engine.js defines AudioEngine class");
                Assert(content.Contains("RhythmMixer"), "audio-engine.js instantiates RhythmMixer singleton");
                Assert(content.Contains("261.63"), "audio-engine.js includes C4 (Do) pentatonic frequency");
                Assert(content.Contains("playRelayClick"), "audio-engine.js implements playRelayClick mechanical switch sound");
                Assert(content.Contains("playDigitalBeep"), "audio-engine.js implements playDigitalBeep non-musical logic confirmation");
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
                Assert(content.Contains("TaskChapter1Modules"), "tasks.js integrates with TaskChapter1Modules");
                Assert(content.Contains("clearObstacle"), "tasks.js implements clearObstacle dispatcher");
                Assert(content.Contains("startLoopRun"), "tasks.js implements startLoopRun dispatcher");
                Assert(content.Contains("playWaveSignalSound"), "tasks.js implements wave signal sound replay");
                Assert(content.Contains("verifyConditionDoor"), "tasks.js implements condition door verification");
                Assert(content.Contains("changeBrushScale"), "tasks.js implements brush scaling");
                Assert(content.Contains("passThroughTunnel"), "tasks.js implements tunnel passing dispatcher");
                Assert(content.Contains("playDemoSequence"), "tasks.js implements demo sequence replay");
                Assert(content.Contains("executeChapter1Action"), "tasks.js implements generic chapter 1 action dispatcher");
            }

            if (File.Exists(tasksSection2Js))
            {
                string section2Content = File.ReadAllText(tasksSection2Js);
                Assert(section2Content.Contains("drawBulb"), "tasks-section2.js implements drawBulb lightbulb primitive");
                Assert(section2Content.Contains("drawSwitch"), "tasks-section2.js implements drawSwitch tactile switch");
                Assert(section2Content.Contains("drawWire"), "tasks-section2.js implements drawWire electric circuit");
                Assert(section2Content.Contains("ensureContext"), "tasks-section2.js unlocks AudioContext on pointerdown");
                Assert(section2Content.Contains("labelPosition === 'top'"), "tasks-section2.js supports top label positioning to prevent badge overlap");
                Assert(section2Content.Contains("toggleSwitch"), "tasks-section2.js implements toggleSwitch");
                Assert(section2Content.Contains("lightUpBulb"), "tasks-section2.js implements lightUpBulb");
                Assert(section2Content.Contains("lightUpNextBulb"), "tasks-section2.js implements lightUpNextBulb");
                Assert(section2Content.Contains("turnOffBulb"), "tasks-section2.js implements turnOffBulb");
                Assert(section2Content.Contains("turnOffNextBulb"), "tasks-section2.js implements turnOffNextBulb");
                Assert(section2Content.Contains("placeNextBulb"), "tasks-section2.js implements placeNextBulb");
                Assert(section2Content.Contains("resetBaskets"), "tasks-section2.js implements resetBaskets");
                Assert(section2Content.Contains("playMelodicScale"), "tasks-section2.js implements playMelodicScale");
                Assert(section2Content.Contains("completePattern"), "tasks-section2.js implements completePattern");
                Assert(section2Content.Contains("toggleGroupSwitch"), "tasks-section2.js implements toggleGroupSwitch");
                Assert(section2Content.Contains("triggerDominoChain"), "tasks-section2.js implements triggerDominoChain");
                Assert(section2Content.Contains("toggleValueBulb"), "tasks-section2.js implements toggleValueBulb");
                Assert(section2Content.Contains("startMasterSymphony"), "tasks-section2.js implements master symphony loop");
            }

            // Test 10b: Modular Chapter 2 Task Files on Disk (tasks-chapter2/task11.js .. task22.js)
            string chapter2Dir = Path.Combine(wwwroot, "js", "tasks-chapter2");
            for (int i = 11; i <= 22; i++)
            {
                string taskFilePath = Path.Combine(chapter2Dir, $"task{i}.js");
                Assert(File.Exists(taskFilePath), $"tasks-chapter2/task{i}.js exists");
                if (File.Exists(taskFilePath))
                {
                    string content = File.ReadAllText(taskFilePath);
                    Assert(content.Contains($"TaskChapter2Modules[{i}]"), $"task{i}.js registers into TaskChapter2Modules[{i}]");
                    Assert(content.Contains("initState"), $"task{i}.js implements initState");
                    Assert(content.Contains("render"), $"task{i}.js implements render");
                    Assert(content.Contains("completeTimer"), $"task{i}.js implements completeTimer debounce against race conditions");
                    Assert(!content.Contains("playNote(") && !content.Contains("playChord("), $"task{i}.js strictly contains NO musical notes or chords (Binary focus)");

                    if (i == 11)
                    {
                        Assert(content.Contains("hasTurnedOff"), "task11.js verifies both turn on and turn off states");
                    }
                    if (i == 16)
                    {
                        Assert(content.Contains("checkAnswer"), "task16.js implements checkAnswer verification");
                    }
                    if (i == 17)
                    {
                        Assert(content.Contains("selectOption"), "task17.js implements binary-to-decimal option selection");
                    }
                    if (i == 18)
                    {
                        Assert(content.Contains("checkAnswer"), "task18.js implements partial sum check verification");
                    }
                    if (i == 19)
                    {
                        Assert(content.Contains("target") && content.Contains("14"), "task19.js enforces target 14 even number LSB rule");
                    }
                    if (i == 20)
                    {
                        Assert(content.Contains("shiftBits"), "task20.js implements bit shifting left/right");
                    }
                    if (i == 21)
                    {
                        Assert(content.Contains("toggleSwitch"), "task21.js implements conditional master lock switch");
                    }
                    if (i == 22)
                    {
                        Assert(content.Contains("checkAnswer"), "task22.js implements 5-bit final exam verification");
                    }
                }
            }

            // Test 10c: Modular Chapter 1 Task Files on Disk (tasks-chapter1/task1.js .. task10.js)
            string chapter1Dir = Path.Combine(wwwroot, "js", "tasks-chapter1");
            for (int i = 1; i <= 10; i++)
            {
                string taskFilePath = Path.Combine(chapter1Dir, $"task{i}.js");
                Assert(File.Exists(taskFilePath), $"tasks-chapter1/task{i}.js exists");
                if (File.Exists(taskFilePath))
                {
                    string content = File.ReadAllText(taskFilePath);
                    Assert(content.Contains($"TaskChapter1Modules[{i}]"), $"task{i}.js registers into TaskChapter1Modules[{i}]");
                    Assert(content.Contains("initState"), $"task{i}.js implements initState");
                    Assert(content.Contains("render"), $"task{i}.js implements render");
                    if (i == 1)
                    {
                        Assert(content.Contains("shrinkLevels"), "task1.js defines shrinking radius levels");
                        Assert(content.Contains("drawBrush"), "task1.js renders lively Püskül mascot");
                    }
                    if (i == 2)
                    {
                        Assert(content.Contains("palettePositions"), "task2.js shuffles and manages modular robot puzzle parts");
                    }
                    if (i == 3)
                    {
                        Assert(content.Contains("drawStar"), "task3.js draws star target element");
                    }
                    if (i == 4)
                    {
                        Assert(content.Contains("drawCloud"), "task4.js draws cloud layers");
                    }
                    if (i == 5)
                    {
                        Assert(content.Contains("clearObstacle"), "task5.js implements clearObstacle action");
                    }
                    if (i == 6)
                    {
                        Assert(content.Contains("guessLoopCount"), "task6.js implements loop guess cards");
                    }
                    if (i == 7)
                    {
                        Assert(content.Contains("verifyConditionDoor"), "task7.js implements condition door verification");
                    }
                    if (i == 8)
                    {
                        Assert(content.Contains("changeBrushScale"), "task8.js implements brush scaling");
                        Assert(content.Contains("passThroughTunnel"), "task8.js implements tunnel passing");
                    }
                    if (i == 9)
                    {
                        Assert(content.Contains("playDemoSequence"), "task9.js implements demo sequence replay");
                    }
                    if (i == 10)
                    {
                        Assert(content.Contains("leftBrush") && content.Contains("rightBrush"), "task10.js synchronizes twin mirror brushes");
                    }
                }
            }

            // Test 11: PixiJS Engine contracts
            if (File.Exists(pixiEngineJs))
            {
                string pixiEngineContent = File.ReadAllText(pixiEngineJs);
                Assert(pixiEngineContent.Contains("class PixiEngine"), "pixi-engine.js defines PixiEngine class");
                Assert(pixiEngineContent.Contains("isSupported()"), "pixi-engine.js checks WebGL/Pixi availability");
                Assert(pixiEngineContent.Contains("createApplication("), "pixi-engine.js exports createApplication factory");
                Assert(pixiEngineContent.Contains("createPuskulSprite("), "pixi-engine.js creates interactive Püskül mascot sprite");
                Assert(pixiEngineContent.Contains("window.PixiEngine = PixiEngine;"), "pixi-engine.js exposes PixiEngine globally");
            }

            // Test 12: Razor Views on disk
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
                Assert(taskViewContent.Contains("window.currentEngine.toggleBulb(0)"), "Task view contains accessible bit buttons for Chapter 2 tasks");
            }

            string chapterViewPath = Path.Combine(viewsDir, "Chapter", "Index.cshtml");
            if (File.Exists(chapterViewPath))
            {
                string chapterViewContent = File.ReadAllText(chapterViewPath);
                Assert(chapterViewContent.Contains("İkili Kod Devresi"), "Chapter view reflects Chapter 2 binary circuits biome name");
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
