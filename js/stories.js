"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteButton = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const star = Boolean(currentUser);
  return  $(`
      <li id="${story.storyId}">
      ${showDeleteButton ? deleteButton() : ""}
      ${ star ? getFavoriteStar(story, currentUser): ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function storyInfo(evt){
  evt.preventDefault();

  const title = $("#title-input").val();
  const author = $("#author-input").val();
  const url = $("#url-input").val();

const story = await storyList.addStory(currentUser, {title, author, url});

const generateStory = generateStoryMarkup(story);
$allStoriesList.prepend(generateStory);


$storyForm.trigger("reset");
$storyForm.hide();
} 

$getStory.on("click", storyInfo);

function deleteButton(){
  return `<span class="trash-can">
  <i class="far fa-trash-alt"></i>
</span>`;
} 

async function deleteStory(evt){
   const targetLi = $(evt.target).closest("li");
   const storyId = targetLi.attr("id");

   await storyList.removeStory(currentUser, storyId);

   putUSerStoriesOnPage();

}

$ownStories.on("click", ".trash-can", deleteStory);

function putUSerStoriesOnPage(){
  $ownStories.empty();

  if (currentUser.ownStories.length === 0){
    $ownStories.append("<h4>No Stories Added By User<h4>");
  } else {
    for (let story of currentUser.ownStories){
      let newStory = generateStoryMarkup(story, true);
      $ownStories.append(newStory);
    }
  }
  $ownStories.show();
}

function getFavoriteStar(story, user){
  const myFavorite = user.isFavorite(story);
  const showStar = myFavorite ? "fas" : "far";
  return `<span class="favorite-star"><i class="${showStar} fa-star"></i></span>`
}

function showFavoritesOnPage(){
  $favoriteStories.empty();

  if (currentUser.favorites.length === 0){
    $favoriteStories.append("<h4>No Favorites<h4>");
  } else {
    for (let story of currentUser.favorites){
      let newStory = generateStoryMarkup(story);
      $favoriteStories.append(newStory);
    }
  }
  $favoriteStories.show();
}

async function switchFavoriteStar(evt){
  const target = $(evt.target);
  const targetLi = $(evt.target).closest("li");
  const storyId = targetLi.attr("id");
  const story = storyList.stories.find(x => x.storyId === storyId);

  if (target.hasClass("fas")){
    await currentUser.removeFavorite(story);
    target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    target.closest("i").toggleClass("fas far");
  }
}

$allStoriesList.on("click", ".favorite-star", switchFavoriteStar);