import { Component } from "@angular/core";
import { Media, MediaObject } from "@ionic-native/media";

import { NavController, IonicPage } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class TestPage {
  toUser: Object;

  constructor(public navCtrl: NavController, private media: Media) {
    this.toUser = {
      toUserId: "210000198410281948",
      toUserName: "Hancock"
    };
  }

  recordVoice() {
    const file: MediaObject = this.media.create("file.mp3");

    // to listen to plugin events:

    file.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes

    file.onSuccess.subscribe(() => console.log("Action is successful"));

    file.onError.subscribe(error => console.log("Error!", error));

    // play the file
    file.play();

    // pause the file
    file.pause();

    // get current playback position
    file.getCurrentPosition().then(position => {
      console.log(position);
    });

    // get file duration
    let duration = file.getDuration();
    console.log(duration);

    // skip to 10 seconds (expects int value in ms)
    file.seekTo(10000);

    // stop playing the file
    file.stop();

    // release the native audio resource
    // Platform Quirks:
    // iOS simply create a new instance and the old one will be overwritten
    // Android you must call release() to destroy instances of media when you are done
    file.release();

    // Recording to a file
    const file2: MediaObject = this.media.create("path/to/file.mp3");

    file2.startRecord();

    file2.stopRecord();
  }
}
