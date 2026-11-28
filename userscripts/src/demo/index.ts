import { startBundle } from "../lib/startBundle.ts";
import caritasHiberne from "./caritas-hiberne.ts";
import modeCambouis from "./mode-cambouis.ts";
import tarifsEnChambresAAir from "./tarifs-en-chambres-a-air.ts";

void startBundle([modeCambouis, tarifsEnChambresAAir, caritasHiberne]);
