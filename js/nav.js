"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $ownStories.hide();
  $storyForm.hide();
  $favoriteStories.hide();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function submitStoryClick(evt){
  console.debug("submitStoryClick", evt);
  $storyForm.show();
  $ownStories.hide();
  $favoriteStories.hide();
}

$submitStory.on("click", submitStoryClick);

function showMyStories(evt) {
  console.debug("showMyStories", evt)
  hidePageComponents();
  putUSerStoriesOnPage();
  $ownStories.show();
  $favoriteStories.hide();
}

$navMyStories.on("click", showMyStories);

function showFavorites(evt){
  console.debug("showFavorites", evt)
  hidePageComponents();
  showFavoritesOnPage();
  $favoriteStories.show();
  $ownStories.hide();
  $storyForm.hide();
}

$navFavorites.on("click", showFavorites);