<div id="settings_container">
    <?php include('modules/settings/pages/rules.php'); ?>
    <?php include('modules/settings/pages/about.php'); ?>
    <?php include('modules/settings/pages/help.php'); ?>
    <div class="page_inner">
        <div class="main_title">Settings</div>
        <div class="choose_language_container menu_option">
            <div class="title">
                <h1 class="text_choose_language"><?php echo $language_strings["choose_language"]; ?></h1>
            </div>
            <div class="content">
                <img class="language_flag" src="images/flags/denmark.png" alt="Danish" title="Danish" attr-id="da">
                <img class="language_flag" src="images/flags/united-kingdom.png" alt="English" title="English" attr-id="en">
            </div>
        </div>

        <div class="choose_theme_container menu_option">
            <div class="title">
                <h1 class="text_choose_theme"><?php echo $language_strings["choose_theme"]; ?></h1>
            </div>
            <div class="content">
                <img id="day_theme" class="theme_icon" src="images/day_mode.png" alt="Day Mode" title="Day Mode" attr-id="day">
                <img id="night_theme" class="theme_icon" src="images/night_mode.png" alt="Night Mode" title="Night Mode" attr-id="night">
            </div>
        </div>
        
        <div class="information_container menu_option">
            <div class="title">
                <h1><?php echo $language_strings["information"]; ?></h1>
            </div>
            <div class="content">
                <div class="icon_container rules">
                    <p><?php echo $language_strings["rules_title"]; ?></p>
                    <img src="images/rules.png" alt="Rules" title="Rules" attr-id="rules">
                </div>
                <div class="icon_container about">
                    <p><?php echo $language_strings["about_title"]; ?></p>
                    <img src="images/about.png" alt="About Us" title="About Us" attr-id="about">
                </div>
                <div class="icon_container help">
                    <p><?php echo $language_strings["help_title"]; ?></p>
                    <img src="images/help.png" alt="Help" title="Help" attr-id="help">
                </div>
            </div>
        </div>

        <div class="partners_container">
            <a href="http://oelbong.dk?pongquest" target="_blank">
                <img src="//:0" alt="Oelbong.dk">
                <h2><?php echo $language_strings["partner_text"]; ?></h2>
            </a>
        </div>
        <div class="button cancel_button default_settings"><?php echo $language_strings["default_settings"]; ?></div>
    </div>
    <script src="modules/settings/scripts.js" type="text/javascript"></script>
</div>