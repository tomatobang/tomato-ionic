/**
 * VoicePlay 服务
 */
import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { Events } from "ionic-angular";
import { GlobalService } from "../providers/global.service";

declare var window;

@Injectable()
export class VoicePlayService {
	constructor(
		public plf: Platform,
		public _global: GlobalService,
	) {}

	init() {

	}
}