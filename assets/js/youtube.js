import axios from "axios";

const fetchPlayLists = async (access_token, params) => {
  return await axios
    .get(`https://www.googleapis.com/youtube/v3/playlists`, {
      headers: { Authorization: access_token },
      params,
    })
    .then((data) => data.data.items);
};

export const fetchPlayListItems = async (access_token, params) => {
  return await axios
    .get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
      headers: { Authorization: access_token },
      params,
    })
    .then((data) => data.data.items);
};

export const fetchMyLists = async (access_token) => {
  if (!access_token) return null;
  const myPlaylists = await fetchPlayLists(access_token, {
    part: "id,snippet,status",
    mine: true,
    maxResults: 50,
  });

  let playlists = [];
  for (let mylist of myPlaylists) {
    const list = await fetchPlayListItems(access_token, {
      part: "id,snippet,contentDetails,status",
      playlistId: mylist.id,
      maxResults: 20,
    });

    if (list.some((item) => item.snippet.videoOwnerChannelTitle === "TogoTV")) {
      let items = [];
      for (let item of list) {
        const res = await fetch(
          `https://togotv-api.dbcls.jp/api/date/${item.contentDetails.videoId}`
        );
        const { uploadDate } = await res.json();
        await items.push({
          id: item.id,
          youtubeVideoId: item?.contentDetails?.videoId,
          thumbnail: item?.snippet?.thumbnails?.high?.url,
          title: item?.snippet?.title,
          description: item?.snippet?.description,
          duration: 0,
          courseId: item?.id,
          uploadDate,
          has_aside: false,
        });
      }
      await playlists.push({ info: mylist, items });
    }
  }
  return await playlists;
};

export const fetchMyList = async (access_token, playlist_id) => {
  return await fetchPlayLists(access_token, {
    part: "id,snippet",
    id: playlist_id,
    maxResults: 50,
  });
};

export const addVideoToPlaylist = async (
  access_token,
  playlist_id,
  resource_id
) => {
  await axios({
    method: "post",
    url:
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&alt=json",
    headers: { Authorization: access_token },
    data: {
      snippet: {
        playlistId: playlist_id,
        resourceId: {
          videoId: resource_id,
          kind: "youtube#video",
        },
      },
    },
  });
};

export const removeVideoFromPlaylist = async (access_token, video_id) => {
  await axios.delete(`https://www.googleapis.com/youtube/v3/playlistItems`, {
    headers: { Authorization: access_token },
    params: {
      id: video_id,
    },
  });
};

export const createPlaylist = async (
  access_token,
  title,
  description,
  privacy_status,
  video_id
) => {
  const new_list = await axios({
    method: "post",
    url: `https://www.googleapis.com/youtube/v3/playlists?part=snippet&part=status&alt=json`,
    headers: { Authorization: access_token },
    data: {
      snippet: {
        title,
        description,
      },
      status: {
        privacyStatus: privacy_status,
      },
    },
  });
  await addVideoToPlaylist(access_token, new_list.data.id, video_id);
};


export const updatePrvacyStatus = async (
  access_token,
  playlist_id,
  title,
  privacy_status,
  callback
) => {
  await axios({
    method: "put",
    url: `https://www.googleapis.com/youtube/v3/playlists?part=snippet&part=status`,
    headers: { Authorization: access_token },
    data: {
      id: playlist_id,
      snippet: {
        title,
      },
      status: {
        privacyStatus: privacy_status,
      },
    },
  })
    .then(() => callback())
    .catch(() => alert("プライバシー設定に失敗しました。"));
};

export const deletePlaylist = async (access_token, video_id, callback) => {
  await axios
    .delete(`https://www.googleapis.com/youtube/v3/playlists`, {
      headers: { Authorization: access_token },
      params: {
        id: video_id,
      },
    })
    .then(() => callback());
};

export const updatePlaylistData = async (access_token, playlist, callback) => {
  await axios({
    method: "put",
    url: `https://www.googleapis.com/youtube/v3/playlists?part=snippet`,
    headers: { Authorization: access_token },
    data: {
      id: playlist.id,
      snippet: {
        title: playlist.name,
        description: playlist.description,
      },
    },
  })
    .then((res) => callback(res))
    .catch(() => alert("プレイリストのデータ更新に失敗しました。"));
};