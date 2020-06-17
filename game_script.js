class TheGame {
    constructor(game_oject) {
        this._game_object;

        this._main_container = "#game_container";
        this._folder_name = "the_game";
        this._folder_path = modules_path + this.folder_name + "/";
        this._php_path = this.folder_path + "data.php";

        this._quests_length = 0;
        this._next_quest_index;

        this._current_quest;
    }

    get game_object() {
        return this._game_object;
    }
    set game_object(value) {
        this._game_object = value;
    }

    get main_container() {
        return this._main_container;
    }
    set main_container(value) {
        this._main_container = value;
    }
    get folder_name() {
        return this._folder_name;
    }
    set folder_name(value) {
        this._folder_name = value;
    }
    get folder_path() {
        return this._folder_path;
    }
    set folder_path(value) {
        this._folder_path = value;
    }
    get php_path() {
        return this._php_path;
    }
    set php_path(value) {
        this._php_path = value;
    }

    get quests_length() {
        return this._quests_length;
    }
    set quests_length(value) {
        this._quests_length = value;
    }
    get next_quest_index() {
        return this._next_quest_index;
    }
    set next_quest_index(value) {
        this._next_quest_index = value;
    }
    get current_quest() {
        return this._current_quest;
    }
    set current_quest(value) {
        this._current_quest = value;
    }

    setup(game_object, new_game = 1) {
        this.game_object = game_object;
        // $(main_container).addClass("menu_visible");
        $(header.main_container + " .menu").removeClass("hidden");
        $(header.main_container + " .menu").click();
        const quest_text_more_info_height = $(this.main_container + " .more_info").height();
        $(this.main_container + " .more_info").css("width", quest_text_more_info_height + "px");

        this.quests_length = this.game_object.quests.length;

        if (new_game) {
            for (let i = 0; i < this.quests_length; i++) {
                this.game_object.quests[i] = {
                    id: this.game_object.quests[i],
                    last_used: 0
                }
            }

            this.game_object.player_ids = [];
            let current_team_id = 1;
            for (let i = 0; i < this.game_object.players.length; i++) {
                if (this.game_object.players[i].team == current_team_id) {
                    this.game_object.player_ids.push(this.game_object.players[i].id)
                    if ((this.game_object.player_ids.length - 1) % this.game_object.players_per_team) {
                        current_team_id++;
                    }
                }
            }

            $.ajax({
                url: this.php_path,
                type: "post",
                async: false,
                data: {
                    call_function: "setup_new_game",
                    game_object: this.game_object
                },
                success: function (response) {
                    let res = $.parseJSON(response);
                    the_game.game_object.id = res.game_id;
                    the_game.game_object.teams_data = res.teams_data;

                }
            });
        } else {
            // console.log("game is loaded");
            for (let i = 0; i < this.quests_length; i++) {
                this.game_object.quests[i].id = Number(this.game_object.quests[i].id);
                this.game_object.quests[i].last_used = Number(this.game_object.quests[i].last_used);
                if (this.game_object.quests[i].last_used == this.game_object.round) {
                    this.current_quest = quests.get_by_id(this.game_object.quests[i].id);
                } else if (this.game_object.quests[i].last_used == this.game_object.round + 1) {
                    this.prepare_next_quest(i, this.game_object.quests[i].last_used);
                }
            }
            // 
            this.finish_setup(0);
        }
    }

    finish_setup(new_game = 1) {
        this.setup_buttons();
        this.setup_extra_buttons();
        if (new_game) {
            this.prepare_next_quest(random_number(0, this.quests_length - 1));
            this.show_new_quest(0);
        } else {
            this.show_current_team();
            this.style_new_quest();
        }
    }

    setup_buttons() {
        /* Skip Button */
        const skip_quest_button = this.main_container + " .extra_buttons_container .skip_quest";
        let skip_quest_ready = 1;
        $(skip_quest_button).off('click').on("click", function () {
            if (!skip_quest_ready) {
                return;
            }
            skip_quest_ready = 0;

            if (the_game.check_if_able_to_remove(1)) {
                the_game.show_new_quest(0);
            }
            skip_quest_ready = 1;

            // send_click("skip_quest");
            // gtag('event', 'click', { 'event_category': 'Skip Quest', 'event_label': 'Skipped quest: ' + current_quest.id, 'value': Date.now() });
        });
        /* Skip Button STOP */

        /* Cup Hit Button */
        // This is linked up with Match - and improved to have more advanced scoring system
        const cup_hit_button = this.main_container + " .extra_buttons_container .cup_hit";
        $(cup_hit_button).off('click').on("click", function () {
            // gtag('event', 'click', { 'event_category': 'Cup Hit', 'event_label': 'Hitted quest: ' + current_quest.id, 'value': Date.now() });
            $(cup_scoring_container).addClass('menu_visible');
            // send_click("hit_cup");
        });

        /* New Quest Button */
        const new_quest_button = this.main_container + " #new_quest_button";
        let new_quest_button_ready = 1;
        let new_quest_button_timeline = new TimelineMax({
            paused: true,
            onComplete: new_quest_button_timeline_complete
        });
        new_quest_button_timeline.to(new_quest_button, 0.2, {
            scale: 0.8,
            backgroundColor: "#42da27",
            yoyo: true,
            repeat: 1,
            repeatDelay: 0.05,
            ease: Power4.easeOut
        });
        new_quest_button_timeline.set("body", {
            delay: 0.2
        });

        function new_quest_button_timeline_complete() {
            new_quest_button_ready = 1;
        }

        $(new_quest_button).off('click').on("click", function () {
            if (!new_quest_button_ready) {
                return;
            }
            the_game.go_to_next_round();
            new_quest_button_ready = 0;
            new_quest_button_timeline.restart();
            // send_click("new_quest");
            // gtag('event', 'click', { 'event_category': 'New Quest', 'event_label': 'Next quest: ' + current_quest.id, 'value': Date.now() });
        });

        /* MORE INFO */
        $(this.main_container + " .text_container").off('click').on("click", function () {
            $("#more_quest_text").addClass("open");
            // show_more_info();
        });

        $(this.main_container + " #more_quest_text").off('click').on("click", function () {
            $(this).removeClass("open");
        });
    }

    setup_extra_buttons() {
        let visible_cups = 0;
        const extra_buttons_container = $(this.main_container + " .extra_buttons_container");
        const unused_buttons_container = $(this.main_container + " .unused_buttons_container");
        if (this.game_object.skippable) {
            visible_cups++;
            extra_buttons_container.prepend($(this.main_container + " .unused_buttons_container .skip_quest"));
        } else {
            unused_buttons_container.prepend($(this.main_container + " .extra_buttons_container .skip_quest"));
        }
        if (this.game_object.rerack) {
            visible_cups++;
            extra_buttons_container.prepend($(this.main_container + " .unused_buttons_container .rerack"));
        } else {
            unused_buttons_container.prepend($(this.main_container + " .extra_buttons_container .rerack"));
        }
        if (this.game_object.score_tracking) {
            visible_cups++;
            extra_buttons_container.prepend($(this.main_container + " .unused_buttons_container .cup_hit"));
            cup_scoring = new CupScoring();
        } else {
            unused_buttons_container.prepend($(this.main_container + " .extra_buttons_container .cup_hit"));
        }

        if (!visible_cups) {
            // All buttons hidden
            $(this.main_container).addClass("no_extra_buttons");
        } else {
            $(this.main_container).removeClass("no_extra_buttons");
        }

    }

    get_active_game() {
        let game_object;
        $.ajax({
            url: this.php_path,
            type: "post",
            async: false,
            data: {
                call_function: "get_active_game",
                host_id: user.data.id
            },
            success: function (response) {
                game_object = $.parseJSON(response);
            }
        });
        this.setup(game_object, 0);
    }

    go_to_next_round() {
        this.game_object.round++;
        this.show_new_quest();

        $.ajax({
            url: this.php_path,
            type: "post",
            async: false,
            data: {
                call_function: "go_to_next_round",
                game_id: this.game_object.id,
                round: this.game_object.round,
                active_team: this.game_object.active_team
            }
        });
    }

    get_current_team() {
        let obj = this.game_object.teams_data;
        for (let i = 0; i < the_game.game_object.teams; i++) {
            if (this.game_object.active_team == obj[i].id) {
                return obj[i];
            }
        }
    }

    get_next_team() {
        let obj = this.game_object.teams_data;
        for (let i = 0; i < this.game_object.teams; i++) {
            if (this.game_object.active_team == obj[i].id) {
                if (!(i + 1 - this.game_object.teams)) {
                    return obj[0];
                } else {
                    return obj[i + 1];
                }
            }
        }
    }

    show_current_team() {
        let current_team = this.get_current_team();
        const container = this.main_container + " .inner_container .quest";
        $(container + " .text_container").css("background-color", current_team.color.hex);
        $(this.main_container + " .cup_hit img").attr("src", "images/cup_hit_" + current_team.color.name + ".png");
        $(this.main_container + " .rerack img").attr("src", "images/rerack_" + current_team.color.name + ".png");
    }

    // Prepare next quest, will find the next quest, and place it in the next_quest_image, so that the image will be loaded when the user goes on
    prepare_next_quest(index = -1, round = 0) {
        // Should only go in here, to pick the next quest, and not do anything about the current one...

        // If the next quest has an index
        if (index != -1) {
            this.next_quest_index = index;
            if (round) {
                this.game_object.quests[this.next_quest_index].last_used = round;
            } else {
                this.game_object.quests[this.next_quest_index].last_used = this.game_object.round;
            }
        } else {
            // If there is 
            if (this.game_object.quest_repetition) {

                let counter = 0;
                while (1) {
                    counter++;
                    // Make a better random selector later on, that reduces the amount of loops, but still keeps it random
                    this.next_quest_index = random_number(0, this.quests_length - 1);
                    if (this.game_object.quests[this.next_quest_index].last_used) {
                        if ((this.game_object.round - unique_length) >= this.game_object.quests[this.next_quest_index].last_used) {
                            break;
                        }
                    } else {
                        break;
                    }
                    if (counter > 1000) { // TEMP
                        console.log("panic break");
                        break;
                    }
                }
                this.game_object.quests[this.next_quest_index].last_used = this.game_object.round + 1;
            } else {
                console.log("no quest repetition...");
                this.next_quest_index = random_number(0, this.quests_length - 1);
            }

            if (this.game_object.quests[this.next_quest_index] == undefined) {
                // alert("Kunne ikke finde en ny quest, tilføj flere quests.");
                return 0;
            }
        }
        let next_quest = quests.get_by_id(this.game_object.quests[this.next_quest_index].id);
        $(this.main_container + " .next_quest_image").css("background-image", "url(images/quests/" + next_quest.image + ".png)");
    }

    update_quest_last_used() {
        console.log("update_quest_last_used");
        $.ajax({
            url: this.php_path,
            type: "post",
            async: false,
            data: {
                call_function: "set_quest_last_used",
                game_id: this.game_object.id,
                quests: this.game_object.quests
            }
        });
    }

    show_new_quest(new_team = 1) {
        if (new_team) {
            this.game_object.active_team = this.get_next_team().id;
        } else {
            if (this.current_quest) {
                // Its not a new team, remember to update the current quest last_used
                this.game_object.quests[this.next_quest_index].last_used = this.game_object.round;
            }
        }
        this.show_current_team();

        if (this.next_quest_index != -1) {
            this.current_quest = quests.get_by_id(this.game_object.quests[this.next_quest_index].id); // Set the current quest
            this.style_new_quest();
            this.prepare_next_quest();
        }
        this.update_quest_last_used();
    }

    style_new_quest() {
        const container = this.main_container + " .quest";
        console.log(this.current_quest);
        // Style the name
        $(container + " .name").html(this.current_quest.name);

        let name_length = this.current_quest.name.length;
        let font_size = 2;
        if (name_length > 10) {
            if (name_length > 15) {
                font_size = 1.4;
            } else {
                font_size = 1.8;
            }
        }

        if (small_device || is_ios) {
            // font_size -= 0.3;
        }

        $(container + " .name").css("font-size", font_size + "rem");

        // Style the image
        $(container + " .image").css("background-image", "url(images/quests/" + this.current_quest.image + ".png)");

        // Do we want animation on changing quests?
        // TweenMax.to("#quest_image", 0.5, {autoAlpha:0, yoyo:true, repeat:1, onRepeat:change_image, onRepeatParams:[this_quest.image]});

        // Style the description text
        $(container + " .text_container .text").html(this.current_quest.text);

        let text_length = this.current_quest.text.length;
        font_size = 1.6;
        if (text_length > 40) {
            font_size = 1.4;
            if (text_length > 80) {
                font_size = 1.25;
                if (text_length > 120) {
                    font_size = 1.15;
                    if (text_length > 160) {
                        font_size = 1;
                    }
                }
            }
        }

        if (small_device || is_ios) {
            font_size -= 0.3;
        }

        $(container + " .text_container").css("font-size", font_size + "rem");
        let description = this.current_quest.description;
        if (description == undefined) {
            description = this.current_quest.text;
        }
        $("#more_quest_text .text").html(description);
    }

    check_if_able_to_remove(remove_in_session) {
        if (this.quests_length <= minimum_quests) {
            const text = language.strings.minimum_quests_popup.replace("{{minimum_quests}}", "<b>" + minimum_quests + "</b>");
            popup.show(text);
            return false;
        } else {
            this.remove_quests(remove_in_session);
        }
        return true;
    }

    // Rethink the way remove_in_session works
    remove_quests(remove_in_session) {
        for (let i = 0; i < this.quests_length; i++) {
            if (this.game_object.quests[i].id == this.current_quest.id) {
                if (i < this.next_quest_index) {
                    this.next_quest_index--;
                }
                this.game_object.quests.splice(i, 1);
                break;
            }
        }
        this.quests_length = this.game_object.quests.length;

        if (remove_in_session) {
        }
    }

    end() {
        $.ajax({
            url: this.php_path,
            type: "post",
            async: false,
            data: {
                call_function: "end_game",
                game_id: this.game_object.id
            }
        });
    }

    update_theme() {
    }
    update_language() {
        $(this.main_container + " #new_quest_button").html(language.strings.new_quest);
        $(this.main_container + " .cup_hit p").html(language.strings.cup_hit_button);
        $(this.main_container + " .rerack p").html(language.strings.rerack_button);
        $(this.main_container + " .skip_quest p").html(language.strings.skip_quest_button);

        this.current_quest = quests.get_by_id(this.current_quest.id);
        this.style_new_quest();
    }
}