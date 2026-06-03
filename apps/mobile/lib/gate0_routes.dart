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
  Gate0Route('discover.profileDetail', '/profile/:publicIdentityId'),
  Gate0Route('discover.filters', '/discover/filters'),
  Gate0Route('chats.index', '/chats'),
  Gate0Route('chats.detail', '/chat/:roomId'),
  Gate0Route('chats.lineContactCard', '/chat/:roomId/contact-card/line'),
  Gate0Route('myId.index', '/my-id'),
  Gate0Route('myId.generate', '/my-id/generate'),
  Gate0Route('myId.lineSetup', '/my-id/contact/line'),
  Gate0Route('safety.index', '/safety'),
  Gate0Route('safety.report', '/safety/report/:targetType/:targetId'),
  Gate0Route('safety.blockedUsers', '/safety/blocked-users'),
  Gate0Route('safety.contactExchanges', '/safety/contact-exchanges'),
];

const gate0Tabs = <String>['Discover', 'Chats', 'My ID', 'Safety'];
