class Gate0Route {
  const Gate0Route(this.name, this.path);

  final String name;
  final String path;
}

const gate0Routes = <Gate0Route>[
  Gate0Route('onboarding.login', '/login'),
  Gate0Route('onboarding.publicId', '/onboarding/public-id'),
  Gate0Route('onboarding.profile', '/onboarding/profile'),
  Gate0Route('discover.index', '/discover'),
  Gate0Route('swipe.index', '/swipe'),
  Gate0Route('discover.profileDetail', '/profile/:publicIdentityId'),
  Gate0Route('discover.filters', '/discover/filters'),
  Gate0Route('chat.index', '/chat'),
  Gate0Route('chat.detail', '/chat/:roomId'),
  Gate0Route('chat.lineContactCard', '/chat/:roomId/contact-card/line'),
  Gate0Route('list.index', '/list'),
  Gate0Route('list.safetyActions', '/list/safety'),
  Gate0Route('my.index', '/my'),
  Gate0Route('my.publicIdGenerate', '/my/public-id/generate'),
  Gate0Route('my.lineSetup', '/my/contact/line'),
  Gate0Route('safety.report', '/safety/report/:targetType/:targetId'),
  Gate0Route('safety.blockedUsers', '/safety/blocked-users'),
  Gate0Route('safety.contactExchanges', '/safety/contact-exchanges'),
];

const gate0Tabs = <String>['Discover', 'Swipe', 'Chat', 'List', 'My'];
