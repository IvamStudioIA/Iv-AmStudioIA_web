import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, 'images');
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash-image';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const prompts = [
  {
    name: 'asesoria-bg.png',
    prompt: 'Semi-realistic concept art, cinematic lighting. Split composition: left side shows a hand writing on official tax documents with a golden fountain pen, ink flowing as luminous golden particles. Right side shows six AI agent silhouettes arranged in a semicircle, each glowing with distinct golden auras, holographic Spanish tax forms (modelo 303, 420) floating between them. Background: deep black (#0A0A0A) with intricate golden circuit board patterns (#D4AF37) running like veins across the entire scene. Golden volumetric light rays pierce through from above. Warm amber glow effects on edges. Tech-organic fusion aesthetic. STRICTLY black, gold (#D4AF37), and amber tones ONLY. Absolutely no purple, no blue, no cool tones. Leave center-left area with breathing room for text overlay. 16:9 aspect ratio.'
  },
  {
    name: 'apexpro-bg.png',
    prompt: 'Semi-realistic concept art, cinematic lighting. Split composition: left side shows a precision engine block being assembled, mechanical parts floating in mid-air surrounded by golden energy streams and spark trails. Right side shows a holographic workshop dashboard displaying vehicle diagnostics, appointment calendars and repair workflows, all rendered in golden wireframe. Wrenches and diagnostic tools float weightlessly, connected by golden circuit traces. Background: deep black (#0A0A0A) with detailed golden PCB trace patterns (#D4AF37) covering surfaces like technological veins. Golden forge-like glow emanates from the engine. Warm amber volumetric lighting. STRICTLY black, gold (#D4AF37), and amber tones ONLY. Absolutely no purple, no blue, no cool tones. Leave upper-left breathing room for text. 16:9 aspect ratio.'
  },
  {
    name: 'axismedical-bg.png',
    prompt: 'Semi-realistic concept art, cinematic lighting. Split composition: left side shows a pristine dental chair and medical instruments rendered with photorealistic detail, bathed in warm golden light, a stethoscope draped elegantly catching golden reflections. Right side shows a holographic patient management interface with appointment grids, medical records and treatment plans displayed as golden floating panels connected by luminous data streams. Background: deep black (#0A0A0A) with delicate golden circuit board patterns (#D4AF37) flowing like a nervous system across walls and surfaces. Clean yet technological atmosphere. Golden volumetric light from above. STRICTLY black, gold (#D4AF37), and amber tones ONLY. Absolutely no purple, no blue, no cool tones. Leave center-left breathing room for text. 16:9 aspect ratio.'
  },
  {
    name: 'smashpro-bg.png',
    prompt: 'Semi-realistic concept art, cinematic lighting. Split composition: left side shows a padel racket mid-swing with explosive golden energy trailing behind the ball, motion blur and golden spark particles filling the air. Right side shows a premium padel court from above rendered as a golden holographic blueprint, with player positions, court reservations and match stats displayed as floating golden data panels. The glass court walls reflect golden circuit patterns. Background: deep black (#0A0A0A) with dynamic golden PCB traces (#D4AF37) radiating outward from the impact point like shockwaves. Intense golden volumetric lighting at the point of contact. Athletic energy meets technology. STRICTLY black, gold (#D4AF37), and amber tones ONLY. Absolutely no purple, no blue, no cool tones. Leave left side breathing room for text. 16:9 aspect ratio.'
  },
  {
    name: 'lexone-bg.png',
    prompt: 'Semi-realistic concept art, cinematic lighting. Split composition: left side shows a judicial scale of justice rendered in polished dark metal, perfectly balanced, with golden light illuminating it from behind like a sacred object. Legal codex books with golden page edges stack beneath it. Right side shows holographic legal case files, police report documents and judicial rulings floating in organized layers, connected by golden data streams and circuit traces. A police badge rests at the intersection of both worlds, glowing with embedded golden circuitry. Background: deep black (#0A0A0A) with authoritative golden circuit board patterns (#D4AF37) resembling legal document watermarks. Warm amber volumetric light. STRICTLY black, gold (#D4AF37), and amber tones ONLY. Absolutely no purple, no blue, no cool tones. Leave upper-left breathing room for text. 16:9 aspect ratio.'
  },
  {
    name: 'ivambilling-bg.png',
    prompt: 'Semi-realistic concept art, cinematic lighting. Split composition: left side shows a stack of perfectly organized invoices and contracts, the top document glowing with golden automated signatures and stamps materializing from golden particle streams. Right side shows an automated billing pipeline visualized as golden mechanical gears and conveyor mechanisms processing invoice documents, each document transforming from paper to golden digital format as it moves through the system. Golden currency symbols and payment confirmation checkmarks float like embers. Background: deep black (#0A0A0A) with precise golden circuit board patterns (#D4AF37) suggesting systematic automation. Clean, efficient golden volumetric lighting. STRICTLY black, gold (#D4AF37), and amber tones ONLY. Absolutely no purple, no blue, no cool tones. Leave center breathing room for text. 16:9 aspect ratio.'
  },
  {
    name: 'saas-factory-bg.png',
    prompt: 'Semi-realistic concept art, cinematic lighting. Epic wide composition: a massive dark anvil at the center with molten golden code being hammered into shape by a powerful silhouetted blacksmith mid-strike. Showers of golden sparks explode upward from the impact point, each spark transforming into a tiny golden platform icon. Six finished golden platforms orbit the forge in the air — each representing a different industry: a medical cross, scales of justice, a mechanical gear, a padel racket, a calculator, and a document seal. The forge fire burns intense gold and amber, casting dramatic volumetric light across the entire scene. Heavy atmospheric golden smoke rises. The anvil surface is covered in intricate golden circuit board patterns (#D4AF37) that pulse with energy at each hammer strike. Background: deep black (#0A0A0A) with golden PCB traces spreading outward from the forge like roots of a technological tree. The most epic and dramatic image of the set. STRICTLY black, gold (#D4AF37), and amber tones ONLY. Absolutely no purple, no blue, no cool tones. Leave upper portion breathing room for text. 16:9 aspect ratio.'
  }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateImage(promptData, index) {
  const filePath = path.join(IMAGES_DIR, promptData.name);

  if (fs.existsSync(filePath)) {
    console.log(`[${index + 1}/7] SKIP — ${promptData.name} already exists`);
    return true;
  }

  console.log(`[${index + 1}/7] Generating ${promptData.name}...`);

  const body = {
    contents: [{
      parts: [{
        text: promptData.prompt
      }]
    }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"]
    }
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText.substring(0, 200)}`);
      }

      const data = await response.json();

      // Find the image part in the response
      const candidates = data.candidates || [];
      for (const candidate of candidates) {
        const parts = candidate.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
            const buffer = Buffer.from(part.inlineData.data, 'base64');
            fs.writeFileSync(filePath, buffer);
            console.log(`[${index + 1}/7] SAVED — ${promptData.name} (${(buffer.length / 1024).toFixed(0)}KB)`);
            return true;
          }
        }
      }

      throw new Error('No image data found in response');

    } catch (err) {
      console.error(`[${index + 1}/7] Attempt ${attempt}/3 FAILED for ${promptData.name}: ${err.message}`);
      if (attempt < 3) {
        console.log(`  Retrying in 10s...`);
        await sleep(10000);
      }
    }
  }

  console.error(`[${index + 1}/7] FAILED PERMANENTLY — ${promptData.name}`);
  return false;
}

async function main() {
  console.log('=== Nano Banana Image Generator ===');
  console.log(`Generating ${prompts.length} images...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < prompts.length; i++) {
    const ok = await generateImage(prompts[i], i);
    if (ok) success++;
    else failed++;

    // Wait between generations to avoid rate limits
    if (i < prompts.length - 1) {
      console.log('  Waiting 5s before next...\n');
      await sleep(5000);
    }
  }

  console.log(`\n=== Done! ${success} success, ${failed} failed ===`);
}

main();
