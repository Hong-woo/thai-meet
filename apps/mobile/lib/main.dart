import 'package:flutter/material.dart';

import 'gate0_mock_data.dart';
import 'gate0_routes.dart';

void main() {
  runApp(const ThaiMeetApp());
}

enum Gate0FlowStep { discover, profileDetail, chat, lineContactCard }

class ThaiMeetApp extends StatelessWidget {
  const ThaiMeetApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Thai Meet',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFBE123C),
          primary: const Color(0xFFBE123C),
          surface: const Color(0xFFFFFFFF),
        ),
        scaffoldBackgroundColor: const Color(0xFFFFF8FA),
        useMaterial3: true,
      ),
      home: const Gate0DeviceFrame(child: Gate0Shell()),
    );
  }
}

class Gate0DeviceFrame extends StatelessWidget {
  const Gate0DeviceFrame({required this.child, super.key});

  static const double maxPhonePreviewWidth = 430;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isWidePreview = constraints.maxWidth > maxPhonePreviewWidth;
        final frame = SizedBox(
          key: const ValueKey('gate0-device-frame'),
          width: isWidePreview ? maxPhonePreviewWidth : double.infinity,
          height: constraints.maxHeight,
          child: child,
        );

        if (!isWidePreview) return frame;

        return ColoredBox(
          color: const Color(0xFFFFF8FA),
          child: Center(
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: const Color(0xFFFFFFFF),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.08),
                    blurRadius: 24,
                    offset: const Offset(0, 12),
                  ),
                ],
              ),
              child: frame,
            ),
          ),
        );
      },
    );
  }
}

class Gate0Shell extends StatefulWidget {
  const Gate0Shell({this.lineContactRegistered = true, super.key});

  final bool lineContactRegistered;

  @override
  State<Gate0Shell> createState() => _Gate0ShellState();
}

class _Gate0ShellState extends State<Gate0Shell> {
  final Gate0MockData _data = const Gate0MockData();
  int _index = 0;
  Gate0FlowStep _flowStep = Gate0FlowStep.discover;
  Gate0ContactCardState _contactCardState = Gate0ContactCardState.locked;
  final List<Gate0ContactCardState> _contactSafetyEvents = [];
  bool _hasContactReportEvent = false;
  bool _hasContactBlockEvent = false;
  bool _contactReportClosedNotice = false;
  bool _contactBlockRemovedNotice = false;
  late bool _lineContactRegistered;
  bool _returnToChatAfterLineSetup = false;
  bool _swipeQueueSkipped = false;
  bool _lineShareCancelled = false;
  bool _lineContactUpdated = false;
  bool _publicIdShared = false;
  late String _currentPublicId;
  final List<String> _archivedPublicIds = [];
  final Set<String> _sharedPublicIds = {};

  String? get _latestArchivedPublicId =>
      _archivedPublicIds.isEmpty ? null : _archivedPublicIds.last;

  @override
  void initState() {
    super.initState();
    _lineContactRegistered = widget.lineContactRegistered;
    _currentPublicId = _data.mockUser.publicId;
  }

  void _selectTab(int index) {
    setState(() {
      _index = index;
      if (gate0Tabs[index] == 'Discover') {
        _flowStep = Gate0FlowStep.discover;
      }
      if (gate0Tabs[index] == 'Chat') {
        _flowStep = Gate0FlowStep.chat;
      }
    });
  }

  void _openProfileDetail() {
    setState(() {
      _index = gate0Tabs.indexOf('Discover');
      _flowStep = Gate0FlowStep.profileDetail;
    });
  }

  void _startChat() {
    setState(() {
      _index = gate0Tabs.indexOf('Chat');
      _flowStep = Gate0FlowStep.chat;
      _clearContactNotices();
    });
  }

  void _skipSwipeProfile() {
    setState(() {
      _index = gate0Tabs.indexOf('Swipe');
      _swipeQueueSkipped = true;
    });
  }

  void _returnToDiscoverFromSwipe() {
    setState(() {
      _index = gate0Tabs.indexOf('Discover');
      _flowStep = Gate0FlowStep.discover;
    });
  }

  void _showLineContactCard() {
    if (!_lineContactRegistered) {
      _openLineSetupFromChat();
      return;
    }

    setState(() {
      _index = gate0Tabs.indexOf('Chat');
      _flowStep = Gate0FlowStep.lineContactCard;
      _clearContactNotices();
      _lineShareCancelled = false;
      if (_contactCardState == Gate0ContactCardState.locked) {
        _contactCardState = Gate0ContactCardState.available;
      }
    });
  }

  void _cancelLineShare() {
    setState(() {
      _index = gate0Tabs.indexOf('Chat');
      _flowStep = Gate0FlowStep.chat;
      _lineShareCancelled = true;
    });
  }

  void _reviewLineShare() {
    setState(() {
      _index = gate0Tabs.indexOf('Chat');
      _flowStep = Gate0FlowStep.chat;
      _lineShareCancelled = false;
    });
  }

  void _reviewRevokedContactCard() {
    setState(() {
      _index = gate0Tabs.indexOf('Chat');
      _flowStep = Gate0FlowStep.chat;
      _contactCardState = Gate0ContactCardState.locked;
      _lineShareCancelled = false;
    });
  }

  void _unblockContactCard() {
    setState(() {
      _contactCardState = _hasContactReportEvent
          ? Gate0ContactCardState.reported
          : Gate0ContactCardState.locked;
      _hasContactBlockEvent = false;
      _contactBlockRemovedNotice = true;
      _lineShareCancelled = false;
    });
  }

  void _closeReportReview() {
    setState(() {
      _contactCardState = Gate0ContactCardState.locked;
      _hasContactReportEvent = false;
      _contactReportClosedNotice = true;
      _contactBlockRemovedNotice = false;
      _lineShareCancelled = false;
    });
  }

  void _reopenReportReview() {
    setState(() {
      _contactCardState = Gate0ContactCardState.reported;
      _hasContactReportEvent = true;
      _clearContactNotices();
      _lineShareCancelled = false;
    });
  }

  void _clearContactNotices() {
    _contactReportClosedNotice = false;
    _contactBlockRemovedNotice = false;
  }

  void _applyContactCardState(Gate0ContactCardState state) {
    _contactCardState = state;
    if (state.isSafetyLedgerEvent && !_contactSafetyEvents.contains(state)) {
      _contactSafetyEvents.add(state);
    }
    if (state == Gate0ContactCardState.reported) {
      _hasContactReportEvent = true;
      _clearContactNotices();
    }
    if (state == Gate0ContactCardState.blocked) {
      _hasContactBlockEvent = true;
      _clearContactNotices();
    }
  }

  void _selectContactCardState(Gate0ContactCardState state) {
    setState(() {
      _flowStep = Gate0FlowStep.lineContactCard;
      _applyContactCardState(state);
    });
  }

  void _selectProfileSafetyState(Gate0ContactCardState state) {
    setState(() {
      _flowStep = Gate0FlowStep.profileDetail;
      _applyContactCardState(state);
    });
  }

  void _openLineSetupFromChat() {
    setState(() {
      _index = gate0Tabs.indexOf('My');
      _returnToChatAfterLineSetup = true;
    });
  }

  void _completeLineSetup() {
    setState(() {
      final wasRegistered = _lineContactRegistered;
      _lineContactRegistered = true;
      if (_returnToChatAfterLineSetup) {
        _index = gate0Tabs.indexOf('Chat');
        _flowStep = Gate0FlowStep.chat;
        _returnToChatAfterLineSetup = false;
      } else {
        _index = gate0Tabs.indexOf('My');
        _lineContactUpdated = wasRegistered;
      }
    });
  }

  void _regeneratePublicId() {
    setState(() {
      _archivedPublicIds.add(_currentPublicId);
      _currentPublicId = _nextPublicId(_currentPublicId);
      _lineContactUpdated = false;
      _publicIdShared = false;
    });
  }

  void _sharePublicId() {
    setState(() {
      _publicIdShared = true;
      _sharedPublicIds.add(_currentPublicId);
    });
  }

  void _openPublicIdHistory() {
    setState(() {
      _index = gate0Tabs.indexOf('List');
    });
  }

  void _openPublicIdManager() {
    setState(() {
      _index = gate0Tabs.indexOf('My');
    });
  }

  void _openCurrentContactCard() {
    setState(() {
      _index = gate0Tabs.indexOf('Chat');
      _flowStep = Gate0FlowStep.lineContactCard;
    });
  }

  String _nextPublicId(String publicId) {
    final parts = publicId.split('-');
    final currentNumber = int.tryParse(parts.last) ?? 1;
    parts[parts.length - 1] = (currentNumber + 1).toString().padLeft(3, '0');
    return parts.join('-');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Thai Meet', key: ValueKey('gate0-shell-app-title')),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(
              child: PublicIdBadge(
                publicId: _currentPublicId,
                labelKey: const ValueKey('gate0-shell-public-id-badge'),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(child: _buildCurrentScreen()),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _index,
        onTap: _selectTab,
        selectedItemColor: const Color(0xFFBE123C),
        unselectedItemColor: const Color(0xFF6F5660),
        type: BottomNavigationBarType.fixed,
        items: [
          for (final tab in gate0Tabs)
            BottomNavigationBarItem(
              icon: Icon(_iconForTab(tab), key: ValueKey(_tabIconKey(tab))),
              label: tab,
            ),
        ],
      ),
    );
  }

  Widget _buildCurrentScreen() {
    return switch (gate0Tabs[_index]) {
      'Discover' => _flowStep == Gate0FlowStep.profileDetail
          ? ProfileDetail(
              profile: _data.discoverProfile,
              hasContactReportEvent: _hasContactReportEvent,
              hasContactBlockEvent: _hasContactBlockEvent,
              onStartChat: _startChat,
              onSelectContactCardState: _selectProfileSafetyState)
          : DiscoverSwipe(
              profile: _data.discoverProfile,
              onOpenProfileDetail: _openProfileDetail,
              onStartChat: _startChat),
      'Swipe' => SwipeQueue(
          profile: _data.discoverProfile,
          hasSkippedProfile: _swipeQueueSkipped,
          onOpenProfileDetail: _openProfileDetail,
          onSkipProfile: _skipSwipeProfile,
          onReturnToDiscover: _returnToDiscoverFromSwipe),
      'Chat' => ChatContactCard(
          messages: _data.chatMessages,
          contactCardsByState: _data.contactCardsByState,
          flowStep: _flowStep,
          contactCardState: _contactCardState,
          lineContactRegistered: _lineContactRegistered,
          lineShareCancelled: _lineShareCancelled,
          onShowLineContactCard: _showLineContactCard,
          onCancelLineShare: _cancelLineShare,
          onReviewLineShare: _reviewLineShare,
          onReviewRevokedContactCard: _reviewRevokedContactCard,
          onSetupLine: _openLineSetupFromChat,
          onSelectContactCardState: _selectContactCardState,
        ),
      'List' => ListSafetyActions(
          archivedPublicIds: _archivedPublicIds,
          sharedPublicIds: _sharedPublicIds,
          currentPublicId: _currentPublicId,
          publicIdShared: _publicIdShared,
          safetyProfile: _data.discoverProfile,
          contactCardState: _contactCardState,
          contactSafetyEvents: _contactSafetyEvents,
          hasContactReportEvent: _hasContactReportEvent,
          hasContactBlockEvent: _hasContactBlockEvent,
          contactReportClosedNotice: _contactReportClosedNotice,
          contactBlockRemovedNotice: _contactBlockRemovedNotice,
          onSelectContactCardState: _selectContactCardState,
          onOpenCurrentContactCard: _openCurrentContactCard,
          onOpenPublicIdManager: _openPublicIdManager,
          onOpenShareFlow: _startChat,
          onReviewRevokedContactCard: _reviewRevokedContactCard,
          onCloseReportReview: _closeReportReview,
          onReopenReportReview: _reopenReportReview,
          onUnblockContactCard: _unblockContactCard),
      'My' => MyPublicMeetId(
          user: _data.mockUser,
          publicId: _currentPublicId,
          archivedPublicId: _latestArchivedPublicId,
          archivedPublicIdWasShared: _latestArchivedPublicId != null &&
              _sharedPublicIds.contains(_latestArchivedPublicId),
          lineContactRegistered: _lineContactRegistered,
          lineContactUpdated: _lineContactUpdated,
          publicIdShared: _publicIdShared,
          onRegeneratePublicId: _regeneratePublicId,
          onSharePublicId: _sharePublicId,
          onSetupLine: _completeLineSetup,
          onViewPublicIdHistory: _openPublicIdHistory),
      _ => DiscoverSwipe(
          profile: _data.discoverProfile,
          onOpenProfileDetail: _openProfileDetail,
          onStartChat: _startChat),
    };
  }

  IconData _iconForTab(String tab) {
    return switch (tab) {
      'Discover' => Icons.travel_explore,
      'Swipe' => Icons.style,
      'Chat' => Icons.chat_bubble_outline,
      'List' => Icons.view_list,
      'My' => Icons.person_outline,
      _ => Icons.circle_outlined,
    };
  }

  String _tabIconKey(String tab) {
    return switch (tab) {
      'Discover' => 'gate0-tab-discover-icon',
      'Swipe' => 'gate0-tab-swipe-icon',
      'Chat' => 'gate0-tab-chat-icon',
      'List' => 'gate0-tab-list-icon',
      'My' => 'gate0-tab-my-icon',
      _ => 'gate0-tab-unknown-icon',
    };
  }
}

class DiscoverSwipe extends StatelessWidget {
  const DiscoverSwipe({
    required this.profile,
    required this.onOpenProfileDetail,
    required this.onStartChat,
    super.key,
  });

  final Gate0DiscoverProfile profile;
  final VoidCallback onOpenProfileDetail;
  final VoidCallback onStartChat;

  @override
  Widget build(BuildContext context) {
    return Gate0ScreenFrame(
      title: 'Discover',
      titleKey: const ValueKey('gate0-discover-screen-title'),
      subtitle: 'Meet people nearby without exposing LINE by default.',
      subtitleKey: const ValueKey('gate0-discover-screen-subtitle'),
      children: [
        ProfileCard(profile: profile, onOpenProfileDetail: onOpenProfileDetail),
        const SizedBox(height: 12),
        const QuickMessageBox(),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: FilledButton.icon(
            key: const ValueKey('gate0-start-chat'),
            onPressed: onStartChat,
            icon: const Icon(Icons.chat_bubble_outline),
            label: const Text(
              'Start Chat',
              key: ValueKey('gate0-start-chat-label'),
            ),
          ),
        ),
      ],
    );
  }
}

class SwipeQueue extends StatelessWidget {
  const SwipeQueue({
    required this.profile,
    required this.hasSkippedProfile,
    required this.onOpenProfileDetail,
    required this.onSkipProfile,
    required this.onReturnToDiscover,
    super.key,
  });

  final Gate0DiscoverProfile profile;
  final bool hasSkippedProfile;
  final VoidCallback onOpenProfileDetail;
  final VoidCallback onSkipProfile;
  final VoidCallback onReturnToDiscover;

  @override
  Widget build(BuildContext context) {
    return Gate0ScreenFrame(
      title: 'Swipe',
      titleKey: const ValueKey('gate0-swipe-screen-title'),
      subtitle: 'Move quickly while LINE stays private.',
      subtitleKey: const ValueKey('gate0-swipe-screen-subtitle'),
      children: [
        if (hasSkippedProfile)
          SwipeEmptyCard(onReturnToDiscover: onReturnToDiscover)
        else
          SwipeQueueCard(
            profile: profile,
            onOpenProfileDetail: onOpenProfileDetail,
            onSkipProfile: onSkipProfile,
          ),
      ],
    );
  }
}

class SwipeQueueCard extends StatelessWidget {
  const SwipeQueueCard({
    required this.profile,
    required this.onOpenProfileDetail,
    required this.onSkipProfile,
    super.key,
  });

  final Gate0DiscoverProfile profile;
  final VoidCallback onOpenProfileDetail;
  final VoidCallback onSkipProfile;

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('gate0-swipe-queue-card'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        border: Border.all(color: const Color(0xFFF2D4DC)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Expanded(
                child: Text('Swipe Queue',
                    key: ValueKey('gate0-swipe-queue-title'),
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              ),
              const ProfileStatusChip(
                  key: ValueKey('gate0-swipe-queue-count-chip'),
                  icon: Icons.filter_1_outlined,
                  labelKey: ValueKey('gate0-swipe-queue-count-label'),
                  label: '1 of 8 nearby'),
            ],
          ),
          const SizedBox(height: 14),
          ProfileVisual(profile: profile),
          const SizedBox(height: 14),
          Text('${profile.displayName}, ${profile.age}',
              style:
                  const TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
          Text('${profile.city} - ${profile.distanceLabel}'),
          const SizedBox(height: 10),
          const Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ProfileStatusChip(
                  key: ValueKey('gate0-swipe-line-hidden-chip'),
                  icon: Icons.visibility_off_outlined,
                  labelKey: ValueKey('gate0-swipe-line-hidden-label'),
                  label: 'LINE hidden until chat'),
              ProfileStatusChip(
                  key: ValueKey('gate0-swipe-public-id-first-chip'),
                  icon: Icons.verified_user_outlined,
                  labelKey: ValueKey('gate0-swipe-public-id-first-label'),
                  label: 'Public ID first'),
            ],
          ),
          const SizedBox(height: 14),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              OutlinedButton.icon(
                key: const ValueKey('gate0-swipe-skip-action'),
                onPressed: onSkipProfile,
                icon: const Icon(Icons.close),
                label: const Text(
                  'Skip',
                  key: ValueKey('gate0-swipe-skip-action-label'),
                ),
              ),
              FilledButton.icon(
                key: const ValueKey('gate0-swipe-open-profile'),
                onPressed: onOpenProfileDetail,
                icon: const Icon(Icons.person_search),
                label: const Text(
                  'View Profile',
                  key: ValueKey('gate0-swipe-open-profile-label'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class SwipeEmptyCard extends StatelessWidget {
  const SwipeEmptyCard({required this.onReturnToDiscover, super.key});

  final VoidCallback onReturnToDiscover;

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('gate0-swipe-empty-card'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        border: Border.all(color: const Color(0xFFD7ECE8)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.check_circle_outline, color: Color(0xFF0F766E)),
              SizedBox(width: 8),
              Expanded(
                child: Text('All caught up',
                    key: ValueKey('gate0-swipe-empty-title'),
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Text(
            'That profile was skipped. LINE stayed hidden.',
            key: ValueKey('gate0-swipe-empty-privacy-copy'),
          ),
          const SizedBox(height: 12),
          const Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ProfileStatusChip(
                  key: ValueKey('gate0-swipe-empty-line-hidden-chip'),
                  icon: Icons.visibility_off_outlined,
                  labelKey: ValueKey('gate0-swipe-empty-line-hidden-label'),
                  label: 'LINE stayed hidden'),
              ProfileStatusChip(
                  key: ValueKey('gate0-swipe-empty-public-id-chip'),
                  icon: Icons.public_outlined,
                  labelKey: ValueKey('gate0-swipe-empty-public-id-label'),
                  label: 'Public ID only'),
            ],
          ),
          const SizedBox(height: 14),
          OutlinedButton.icon(
            key: const ValueKey('gate0-swipe-return-discover'),
            onPressed: onReturnToDiscover,
            icon: const Icon(Icons.travel_explore),
            label: const Text(
              'Back to Discover',
              key: ValueKey('gate0-swipe-return-discover-label'),
            ),
          ),
        ],
      ),
    );
  }
}

class ProfileDetail extends StatelessWidget {
  const ProfileDetail({
    required this.profile,
    required this.hasContactReportEvent,
    required this.hasContactBlockEvent,
    required this.onStartChat,
    required this.onSelectContactCardState,
    super.key,
  });

  final Gate0DiscoverProfile profile;
  final bool hasContactReportEvent;
  final bool hasContactBlockEvent;
  final VoidCallback onStartChat;
  final ValueChanged<Gate0ContactCardState> onSelectContactCardState;

  @override
  Widget build(BuildContext context) {
    return Gate0ScreenFrame(
      title: 'Profile',
      titleKey: const ValueKey('gate0-profile-screen-title'),
      subtitle: 'Check public identity before starting chat.',
      subtitleKey: const ValueKey('gate0-profile-screen-subtitle'),
      children: [
        ProfileSummary(
          profile: profile,
          hasContactReportEvent: hasContactReportEvent,
          hasContactBlockEvent: hasContactBlockEvent,
          onSelectContactCardState: onSelectContactCardState,
        ),
        const SizedBox(height: 12),
        FilledButton.icon(
          key: const ValueKey('gate0-profile-start-chat'),
          onPressed: onStartChat,
          icon: const Icon(Icons.chat_bubble_outline),
          label: const Text(
            'Start Chat',
            key: ValueKey('gate0-profile-start-chat-label'),
          ),
        ),
      ],
    );
  }
}

class ChatContactCard extends StatelessWidget {
  const ChatContactCard({
    required this.messages,
    required this.contactCardsByState,
    required this.flowStep,
    required this.contactCardState,
    required this.lineContactRegistered,
    required this.lineShareCancelled,
    required this.onShowLineContactCard,
    required this.onCancelLineShare,
    required this.onReviewLineShare,
    required this.onReviewRevokedContactCard,
    required this.onSetupLine,
    required this.onSelectContactCardState,
    super.key,
  });

  final List<Gate0ChatMessage> messages;
  final Map<Gate0ContactCardState, Gate0ContactCardModel> contactCardsByState;
  final Gate0FlowStep flowStep;
  final Gate0ContactCardState contactCardState;
  final bool lineContactRegistered;
  final bool lineShareCancelled;
  final VoidCallback onShowLineContactCard;
  final VoidCallback onCancelLineShare;
  final VoidCallback onReviewLineShare;
  final VoidCallback onReviewRevokedContactCard;
  final VoidCallback onSetupLine;
  final ValueChanged<Gate0ContactCardState> onSelectContactCardState;

  @override
  Widget build(BuildContext context) {
    final showCard = flowStep == Gate0FlowStep.lineContactCard;
    return Gate0ScreenFrame(
      title: showCard ? 'LINE sharing' : 'Chat',
      titleKey: const ValueKey('gate0-chat-screen-title'),
      subtitle: 'Raw LINE ID stays out of chat.',
      subtitleKey: const ValueKey('gate0-chat-screen-subtitle'),
      children: [
        for (final message in messages)
          ChatBubble(messageId: message.id, text: message.body),
        const SizedBox(height: 12),
        if (showCard)
          const LineShareReceipt()
        else if (!lineContactRegistered)
          LineSetupRequiredCard(onSetupLine: onSetupLine)
        else if (lineShareCancelled)
          LineShareCancelledCard(onReviewLineShare: onReviewLineShare)
        else
          FirstShareConfirmation(
            onShareLine: onShowLineContactCard,
            onCancelLineShare: onCancelLineShare,
          ),
        const SizedBox(height: 12),
        if (!showCard) ...[
          const ChatLockCard(),
          const SizedBox(height: 12),
        ],
        if (showCard)
          LineContactCard(
            state: contactCardState,
            card: contactCardsByState[contactCardState]!,
            onReviewRevokedContactCard: onReviewRevokedContactCard,
            onSelectState: onSelectContactCardState,
          )
        else if (lineContactRegistered && !lineShareCancelled)
          OutlinedButton.icon(
            key: const ValueKey('gate0-view-contact-card'),
            onPressed: onShowLineContactCard,
            icon: const Icon(Icons.lock_open),
            label: const Text(
              'View Contact Card',
              key: ValueKey('gate0-view-contact-card-label'),
            ),
          ),
      ],
    );
  }
}

class LineSetupRequiredCard extends StatelessWidget {
  const LineSetupRequiredCard({required this.onSetupLine, super.key});

  final VoidCallback onSetupLine;

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('gate0-line-setup-required'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFBEB),
        border: Border.all(color: const Color(0xFFFDE68A)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.add_link_outlined, color: Color(0xFF92400E)),
              SizedBox(width: 8),
              Expanded(
                child: Text('Set up LINE to share',
                    key: ValueKey('gate0-line-setup-required-title'),
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Text(
            'Register LINE before creating a Contact Card. Chat stays open and raw LINE stays out of messages.',
            key: ValueKey('gate0-line-setup-required-detail'),
          ),
          const SizedBox(height: 12),
          const Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              KeyedSubtree(
                key: ValueKey('gate0-line-setup-required-hidden-chip'),
                child: ProfileStatusChip(
                    icon: Icons.visibility_off_outlined,
                    labelKey:
                        ValueKey('gate0-line-setup-required-hidden-label'),
                    label: 'Raw LINE still hidden'),
              ),
              KeyedSubtree(
                key: ValueKey('gate0-line-setup-required-chat-chip'),
                child: ProfileStatusChip(
                    icon: Icons.chat_bubble_outline,
                    labelKey: ValueKey('gate0-line-setup-required-chat-label'),
                    label: 'Chat stays open'),
              ),
            ],
          ),
          const SizedBox(height: 14),
          FilledButton.icon(
            key: const ValueKey('gate0-line-setup-from-chat'),
            onPressed: onSetupLine,
            icon: const Icon(Icons.add_link_outlined),
            label: const Text(
              'Set up LINE',
              key: ValueKey('gate0-line-setup-from-chat-label'),
            ),
          ),
        ],
      ),
    );
  }
}

class LineShareReceipt extends StatelessWidget {
  const LineShareReceipt({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('gate0-line-share-receipt'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDFA),
        border: Border.all(color: const Color(0xFF99F6E4)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.check_circle_outline, color: Color(0xFF0F766E)),
              SizedBox(width: 8),
              Expanded(
                child: Text('LINE share confirmed',
                    key: ValueKey('gate0-line-share-receipt-title'),
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              ),
            ],
          ),
          SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ProfileStatusChip(
                  key: ValueKey('gate0-line-share-receipt-hidden-chip'),
                  icon: Icons.visibility_off_outlined,
                  labelKey: ValueKey('gate0-line-share-receipt-hidden-label'),
                  label: 'Raw LINE still hidden'),
            ],
          ),
          SizedBox(height: 10),
          Row(
            children: [
              Icon(Icons.undo_outlined, size: 18, color: Color(0xFF0F766E)),
              SizedBox(width: 6),
              Expanded(
                child: Text('Contact Card can be revoked',
                    key: ValueKey('gate0-line-share-receipt-revoke-copy')),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class ChatLockCard extends StatelessWidget {
  const ChatLockCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('gate0-chat-lock-card'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        border: Border.all(color: const Color(0xFFD7ECE8)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.lock_outline, color: Color(0xFF0F766E)),
              SizedBox(width: 8),
              Expanded(
                child: Text('Contact Card locked',
                    key: ValueKey('gate0-chat-lock-card-title'),
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              ),
            ],
          ),
          SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              KeyedSubtree(
                key: ValueKey('gate0-chat-lock-card-hidden-chip'),
                child: ProfileStatusChip(
                    icon: Icons.chat_bubble_outline,
                    labelKey: ValueKey('gate0-chat-lock-card-hidden-label'),
                    label: 'Raw LINE not in messages'),
              ),
              KeyedSubtree(
                key: ValueKey('gate0-chat-lock-card-choice-chip'),
                child: ProfileStatusChip(
                    icon: Icons.verified_user_outlined,
                    labelKey: ValueKey('gate0-chat-lock-card-choice-label'),
                    label: 'Share only by choice'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class FirstShareConfirmation extends StatelessWidget {
  const FirstShareConfirmation({
    required this.onShareLine,
    required this.onCancelLineShare,
    super.key,
  });

  final VoidCallback onShareLine;
  final VoidCallback onCancelLineShare;

  @override
  Widget build(BuildContext context) {
    return TrustPanel(
      key: const ValueKey('gate0-share-line-confirmation'),
      title: 'Share LINE?',
      titleKey: const ValueKey('gate0-share-line-confirmation-title'),
      body:
          'Confirm once before creating a redacted LINE Contact Card. Raw LINE ID stays out of chat history.',
      bodyKey: const ValueKey('gate0-share-line-confirmation-body'),
      actions: [
        PanelAction(
            key: const ValueKey('gate0-share-line-cancel'),
            labelKey: const ValueKey('gate0-share-line-cancel-label'),
            label: 'Cancel',
            onPressed: onCancelLineShare),
        PanelAction(
            key: const ValueKey('gate0-share-line'),
            labelKey: const ValueKey('gate0-share-line-label'),
            label: 'Share LINE',
            onPressed: onShareLine),
      ],
    );
  }
}

class LineShareCancelledCard extends StatelessWidget {
  const LineShareCancelledCard({required this.onReviewLineShare, super.key});

  final VoidCallback onReviewLineShare;

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('gate0-line-share-cancelled'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        border: Border.all(color: const Color(0xFFD7ECE8)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.lock_outline, color: Color(0xFF0F766E)),
              SizedBox(width: 8),
              Expanded(
                child: Text('LINE share cancelled',
                    key: ValueKey('gate0-line-share-cancelled-title'),
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Text(
            'No Contact Card was created. Raw LINE stayed out of chat.',
            key: ValueKey('gate0-line-share-cancelled-detail'),
          ),
          const SizedBox(height: 12),
          const Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              KeyedSubtree(
                key: ValueKey('gate0-line-share-cancelled-hidden-chip'),
                child: ProfileStatusChip(
                    icon: Icons.visibility_off_outlined,
                    labelKey:
                        ValueKey('gate0-line-share-cancelled-hidden-label'),
                    label: 'Raw LINE still hidden'),
              ),
              KeyedSubtree(
                key: ValueKey('gate0-line-share-cancelled-chat-chip'),
                child: ProfileStatusChip(
                    icon: Icons.chat_bubble_outline,
                    labelKey: ValueKey('gate0-line-share-cancelled-chat-label'),
                    label: 'Chat stays open'),
              ),
            ],
          ),
          const SizedBox(height: 14),
          OutlinedButton.icon(
            key: const ValueKey('gate0-review-line-share'),
            onPressed: onReviewLineShare,
            icon: const Icon(Icons.rate_review_outlined),
            label: const Text(
              'Review sharing again',
              key: ValueKey('gate0-review-line-share-label'),
            ),
          ),
        ],
      ),
    );
  }
}

class LineContactCard extends StatelessWidget {
  const LineContactCard({
    required this.state,
    required this.card,
    required this.onReviewRevokedContactCard,
    required this.onSelectState,
    super.key,
  });

  final Gate0ContactCardState state;
  final Gate0ContactCardModel card;
  final VoidCallback onReviewRevokedContactCard;
  final ValueChanged<Gate0ContactCardState> onSelectState;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        LineContactPreview(state: state, card: card),
        const SizedBox(height: 12),
        if (!state.canView) ...[
          ContactStateAlert(state: state),
          const SizedBox(height: 12),
        ],
        TrustPanel(
          key: const ValueKey('gate0-line-contact-card-panel'),
          title: 'LINE Contact Card',
          titleKey: const ValueKey('gate0-line-contact-card-panel-title'),
          body:
              'Contact state: ${state.shortLabel}. ${card.displayLabel}. ${state.description}',
          bodyKey: const ValueKey('gate0-line-contact-card-panel-body'),
          actions: [
            PanelAction(
                key: const ValueKey('gate0-contact-view-action'),
                labelKey: const ValueKey('gate0-contact-view-action-label'),
                label: state.viewActionLabel,
                onPressed: null),
            PanelAction(
                key: const ValueKey('gate0-contact-revoke'),
                labelKey: const ValueKey('gate0-contact-revoke-label'),
                label: state.revokeActionLabel,
                onPressed: state.canRevoke
                    ? () => onSelectState(Gate0ContactCardState.revoked)
                    : null),
            if (state == Gate0ContactCardState.revoked)
              PanelAction(
                  key: const ValueKey('gate0-contact-review-share'),
                  labelKey: const ValueKey('gate0-contact-review-share-label'),
                  label: 'Review sharing again',
                  onPressed: onReviewRevokedContactCard),
            PanelAction(
                key: const ValueKey('gate0-contact-retry'),
                labelKey: const ValueKey('gate0-contact-retry-label'),
                label: state.retryActionLabel,
                onPressed: state == Gate0ContactCardState.providerUnavailable
                    ? () => onSelectState(Gate0ContactCardState.available)
                    : null),
            PanelAction(
                key: const ValueKey('gate0-contact-report'),
                labelKey: const ValueKey('gate0-contact-report-label'),
                label: state.reportActionLabel,
                onPressed: state.canReport
                    ? () => onSelectState(Gate0ContactCardState.reported)
                    : null),
            PanelAction(
                key: const ValueKey('gate0-contact-block'),
                labelKey: const ValueKey('gate0-contact-block-label'),
                label: state.blockActionLabel,
                onPressed: state.canBlock
                    ? () => onSelectState(Gate0ContactCardState.blocked)
                    : null),
          ],
          footer: ContactStateSelector(
            state: state,
            onSelectState: onSelectState,
          ),
        ),
      ],
    );
  }
}

class ContactStateSelector extends StatelessWidget {
  const ContactStateSelector({
    required this.state,
    required this.onSelectState,
    super.key,
  });

  final Gate0ContactCardState state;
  final ValueChanged<Gate0ContactCardState> onSelectState;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      key: const ValueKey('gate0-contact-state-selector'),
      spacing: 8,
      runSpacing: 8,
      children: [
        for (final option in Gate0ContactCardState.values)
          ContactStateOption(
            key: ValueKey('gate0-contact-state-${option.label}'),
            option: option,
            selected: option == state,
            onSelectState: onSelectState,
          ),
      ],
    );
  }
}

class ContactStateOption extends StatelessWidget {
  const ContactStateOption({
    required this.option,
    required this.selected,
    required this.onSelectState,
    super.key,
  });

  final Gate0ContactCardState option;
  final bool selected;
  final ValueChanged<Gate0ContactCardState> onSelectState;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(999),
      onTap: () => onSelectState(option),
      child: Container(
        constraints: const BoxConstraints(minHeight: 44),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: selected ? const Color(0xFFBE123C) : const Color(0xFFFFFFFF),
          border: Border.all(
              color:
                  selected ? const Color(0xFFBE123C) : const Color(0xFFD7ECE8)),
          borderRadius: BorderRadius.circular(999),
        ),
        child: Text(
          option.shortLabel,
          key: ValueKey(_contactStateOptionLabelKey(option)),
          style: TextStyle(
            color: selected ? const Color(0xFFFFFFFF) : const Color(0xFF42212D),
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }

  String _contactStateOptionLabelKey(Gate0ContactCardState state) {
    return switch (state) {
      Gate0ContactCardState.locked => 'gate0-contact-state-locked-label',
      Gate0ContactCardState.available => 'gate0-contact-state-available-label',
      Gate0ContactCardState.revoked => 'gate0-contact-state-revoked-label',
      Gate0ContactCardState.reported => 'gate0-contact-state-reported-label',
      Gate0ContactCardState.blocked => 'gate0-contact-state-blocked-label',
      Gate0ContactCardState.providerUnavailable =>
        'gate0-contact-state-providerUnavailable-label',
    };
  }
}

class ContactStateAlert extends StatelessWidget {
  const ContactStateAlert({required this.state, super.key});

  final Gate0ContactCardState state;

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('gate0-contact-state-alert'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF7ED),
        border: Border.all(color: const Color(0xFFFED7AA)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.lock_clock_outlined, color: Color(0xFF9A3412)),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  state == Gate0ContactCardState.providerUnavailable
                      ? 'Contact access delayed'
                      : 'Contact access unavailable',
                  key: const ValueKey('gate0-contact-state-alert-title'),
                  style: const TextStyle(
                      fontSize: 18, fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
          if (state == Gate0ContactCardState.revoked) ...[
            const SizedBox(height: 8),
            const Text('Contact Card revoked by you',
                key: ValueKey('gate0-contact-state-alert-revoked-title'),
                style: TextStyle(fontWeight: FontWeight.w700)),
            const SizedBox(height: 4),
            const KeyedSubtree(
              key: ValueKey('gate0-contact-state-alert-detail'),
              child: Text(
                'Review sharing again to create a new card.',
                key: ValueKey('gate0-contact-state-alert-revoked-detail'),
              ),
            ),
          ] else if (state == Gate0ContactCardState.reported) ...[
            const SizedBox(height: 8),
            const Text('Report under review',
                key: ValueKey('gate0-contact-state-alert-reported-title'),
                style: TextStyle(fontWeight: FontWeight.w700)),
            const SizedBox(height: 4),
            const KeyedSubtree(
              key: ValueKey('gate0-contact-state-alert-detail'),
              child: Text(
                'Chat stays open while safety reviews it.',
                key: ValueKey('gate0-contact-state-alert-reported-detail'),
              ),
            ),
          ] else if (state == Gate0ContactCardState.providerUnavailable) ...[
            const SizedBox(height: 8),
            const Text('Provider temporarily unavailable',
                key: ValueKey(
                    'gate0-contact-state-alert-provider-unavailable-title'),
                style: TextStyle(fontWeight: FontWeight.w700)),
            const SizedBox(height: 4),
            const KeyedSubtree(
              key: ValueKey('gate0-contact-state-alert-detail'),
              child: Text(
                'Retry keeps raw LINE hidden.',
                key: ValueKey(
                    'gate0-contact-state-alert-provider-unavailable-detail'),
              ),
            ),
          ] else if (state == Gate0ContactCardState.blocked) ...[
            const SizedBox(height: 8),
            const Text('Block stays active',
                key: ValueKey('gate0-contact-state-alert-blocked-title'),
                style: TextStyle(fontWeight: FontWeight.w700)),
            const SizedBox(height: 4),
            const KeyedSubtree(
              key: ValueKey('gate0-contact-state-alert-detail'),
              child: Text(
                'LINE cannot reopen from this chat.',
                key: ValueKey('gate0-contact-state-alert-blocked-detail'),
              ),
            ),
          ],
          const SizedBox(height: 12),
          const Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ProfileStatusChip(
                  key: ValueKey('gate0-contact-state-alert-hidden-chip'),
                  icon: Icons.visibility_off_outlined,
                  labelKey: ValueKey('gate0-contact-state-alert-hidden-label'),
                  label: 'Raw LINE remains hidden'),
              ProfileStatusChip(
                  key: ValueKey('gate0-contact-state-alert-chat-chip'),
                  icon: Icons.chat_bubble_outline,
                  labelKey: ValueKey('gate0-contact-state-alert-chat-label'),
                  label: 'Chat stays open'),
            ],
          ),
        ],
      ),
    );
  }
}

class LineContactPreview extends StatelessWidget {
  const LineContactPreview(
      {required this.state, required this.card, super.key});

  final Gate0ContactCardState state;
  final Gate0ContactCardModel card;

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('gate0-line-contact-preview'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDFA),
        border: Border.all(color: const Color(0xFF99F6E4)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: const Color(0xFF0F766E),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.visibility_off_outlined,
                    color: Color(0xFFFFFFFF)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Redacted LINE card',
                        key: ValueKey('gate0-line-contact-preview-title'),
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.w700)),
                    Text('${card.provider} handle hidden',
                        key: const ValueKey(
                            'gate0-line-contact-preview-subtitle'),
                        style: const TextStyle(color: Color(0xFF475569))),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ProfileStatusChip(
                  key: ValueKey('gate0-line-contact-preview-copy-chip'),
                  icon: Icons.block_outlined,
                  labelKey: ValueKey('gate0-line-contact-preview-copy-label'),
                  label: 'Copy disabled'),
              ProfileStatusChip(
                  key: ValueKey('gate0-line-contact-preview-choice-chip'),
                  icon: Icons.verified_user_outlined,
                  labelKey: ValueKey('gate0-line-contact-preview-choice-label'),
                  label: 'Shared by choice'),
              ProfileStatusChip(
                  key: ValueKey('gate0-line-contact-preview-state-chip'),
                  icon: Icons.shield_outlined,
                  labelKey: ValueKey('gate0-line-contact-preview-state-label'),
                  label: state.shortLabel),
              const ProfileStatusChip(
                  key: ValueKey('gate0-line-contact-preview-safety-chip'),
                  icon: Icons.report_gmailerrorred_outlined,
                  labelKey: ValueKey('gate0-line-contact-preview-safety-label'),
                  label: 'Report or block anytime'),
            ],
          ),
          const SizedBox(height: 12),
          Text(state.description,
              key: const ValueKey('gate0-line-contact-preview-description')),
        ],
      ),
    );
  }
}

class ListSafetyActions extends StatelessWidget {
  const ListSafetyActions({
    required this.archivedPublicIds,
    required this.sharedPublicIds,
    required this.currentPublicId,
    required this.publicIdShared,
    required this.safetyProfile,
    required this.contactCardState,
    required this.contactSafetyEvents,
    required this.hasContactReportEvent,
    required this.hasContactBlockEvent,
    required this.contactReportClosedNotice,
    required this.contactBlockRemovedNotice,
    required this.onSelectContactCardState,
    required this.onOpenCurrentContactCard,
    required this.onOpenPublicIdManager,
    required this.onOpenShareFlow,
    required this.onReviewRevokedContactCard,
    required this.onCloseReportReview,
    required this.onReopenReportReview,
    required this.onUnblockContactCard,
    super.key,
  });

  final List<String> archivedPublicIds;
  final Set<String> sharedPublicIds;
  final String currentPublicId;
  final bool publicIdShared;
  final Gate0DiscoverProfile safetyProfile;
  final Gate0ContactCardState contactCardState;
  final List<Gate0ContactCardState> contactSafetyEvents;
  final bool hasContactReportEvent;
  final bool hasContactBlockEvent;
  final bool contactReportClosedNotice;
  final bool contactBlockRemovedNotice;
  final ValueChanged<Gate0ContactCardState> onSelectContactCardState;
  final VoidCallback onOpenCurrentContactCard;
  final VoidCallback onOpenPublicIdManager;
  final VoidCallback onOpenShareFlow;
  final VoidCallback onReviewRevokedContactCard;
  final VoidCallback onCloseReportReview;
  final VoidCallback onReopenReportReview;
  final VoidCallback onUnblockContactCard;

  @override
  Widget build(BuildContext context) {
    return Gate0ScreenFrame(
      title: 'List',
      titleKey: const ValueKey('gate0-list-screen-title'),
      subtitle: 'Review contact and safety history.',
      subtitleKey: const ValueKey('gate0-list-screen-subtitle'),
      children: [
        SafetyLedgerCard(
          archivedPublicIds: archivedPublicIds,
          sharedPublicIds: sharedPublicIds,
          currentPublicId: currentPublicId,
          publicIdShared: publicIdShared,
          safetyProfile: safetyProfile,
          contactCardState: contactCardState,
          contactSafetyEvents: contactSafetyEvents,
          hasContactReportEvent: hasContactReportEvent,
          hasContactBlockEvent: hasContactBlockEvent,
          contactReportClosedNotice: contactReportClosedNotice,
          contactBlockRemovedNotice: contactBlockRemovedNotice,
          onSelectContactCardState: onSelectContactCardState,
          onOpenCurrentContactCard: onOpenCurrentContactCard,
          onOpenPublicIdManager: onOpenPublicIdManager,
          onOpenShareFlow: onOpenShareFlow,
          onReviewRevokedContactCard: onReviewRevokedContactCard,
          onCloseReportReview: onCloseReportReview,
          onReopenReportReview: onReopenReportReview,
          onUnblockContactCard: onUnblockContactCard,
        ),
      ],
    );
  }
}

class SafetyLedgerCard extends StatelessWidget {
  const SafetyLedgerCard({
    required this.archivedPublicIds,
    required this.sharedPublicIds,
    required this.currentPublicId,
    required this.publicIdShared,
    required this.safetyProfile,
    required this.contactCardState,
    required this.contactSafetyEvents,
    required this.hasContactReportEvent,
    required this.hasContactBlockEvent,
    required this.contactReportClosedNotice,
    required this.contactBlockRemovedNotice,
    required this.onSelectContactCardState,
    required this.onOpenCurrentContactCard,
    required this.onOpenPublicIdManager,
    required this.onOpenShareFlow,
    required this.onReviewRevokedContactCard,
    required this.onCloseReportReview,
    required this.onReopenReportReview,
    required this.onUnblockContactCard,
    super.key,
  });

  final List<String> archivedPublicIds;
  final Set<String> sharedPublicIds;
  final String currentPublicId;
  final bool publicIdShared;
  final Gate0DiscoverProfile safetyProfile;
  final Gate0ContactCardState contactCardState;
  final List<Gate0ContactCardState> contactSafetyEvents;
  final bool hasContactReportEvent;
  final bool hasContactBlockEvent;
  final bool contactReportClosedNotice;
  final bool contactBlockRemovedNotice;
  final ValueChanged<Gate0ContactCardState> onSelectContactCardState;
  final VoidCallback onOpenCurrentContactCard;
  final VoidCallback onOpenPublicIdManager;
  final VoidCallback onOpenShareFlow;
  final VoidCallback onReviewRevokedContactCard;
  final VoidCallback onCloseReportReview;
  final VoidCallback onReopenReportReview;
  final VoidCallback onUnblockContactCard;

  @override
  Widget build(BuildContext context) {
    final reportDetail =
        hasContactReportEvent ? '1 ready for review' : 'No reports pending';
    final blockDetail =
        hasContactBlockEvent ? '1 active block' : 'No active blocks';
    final contactCardsDetail =
        contactCardState == Gate0ContactCardState.available
            ? '1 shared Contact Card'
            : contactSafetyEvents.isEmpty
                ? 'No contact events yet'
                : contactSafetyEvents.length == 1
                    ? '1 safety contact event'
                    : '${contactSafetyEvents.length} safety contact events';
    final sharedArchivedPublicIdCount =
        archivedPublicIds.where(sharedPublicIds.contains).length;
    final archivedPublicIdDetail = sharedArchivedPublicIdCount > 0
        ? sharedArchivedPublicIdCount < archivedPublicIds.length
            ? '$sharedArchivedPublicIdCount shared of ${archivedPublicIds.length} archived IDs, most recent first'
            : sharedArchivedPublicIdCount == 1
                ? '1 shared archived ID, most recent first'
                : '$sharedArchivedPublicIdCount shared archived IDs, most recent first'
        : archivedPublicIds.length == 1
            ? '1 archived ID, most recent first'
            : '${archivedPublicIds.length} archived IDs, most recent first';
    final publicIdsDetail = publicIdShared && sharedArchivedPublicIdCount > 0
        ? sharedArchivedPublicIdCount == 1
            ? '1 current and 1 archived shared ID'
            : '1 current and $sharedArchivedPublicIdCount archived shared IDs'
        : publicIdShared
            ? '1 shared current ID'
            : archivedPublicIds.isNotEmpty
                ? archivedPublicIdDetail
                : 'No public ID events yet';
    final publicIdsIcon = publicIdShared || sharedArchivedPublicIdCount > 0
        ? Icons.ios_share_outlined
        : archivedPublicIds.isNotEmpty
            ? Icons.archive_outlined
            : Icons.badge_outlined;
    final hasPublicIdEvents = publicIdShared || archivedPublicIds.isNotEmpty;
    final recentArchivedPublicIds = archivedPublicIds.reversed.toList();
    final recentContactSafetyEvents = contactSafetyEvents.reversed.toList();
    final hasBlockHistory =
        contactSafetyEvents.contains(Gate0ContactCardState.blocked);
    final hasReportHistory =
        contactSafetyEvents.contains(Gate0ContactCardState.reported);
    final canReviewContactCard =
        contactCardState != Gate0ContactCardState.locked;
    final contactCardReviewLabel = contactCardState.ledgerReviewActionLabel;
    final ledgerReportActionLabel = hasContactReportEvent
        ? 'Report logged'
        : hasContactBlockEvent
            ? 'Report locked'
            : contactReportClosedNotice
                ? 'Reopen Report'
                : contactCardState.ledgerReportActionLabel;
    final ledgerBlockActionLabel = hasContactBlockEvent
        ? 'Block active'
        : contactCardState.ledgerBlockActionLabel;

    return Container(
      key: const ValueKey('gate0-safety-ledger'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        border: Border.all(color: const Color(0xFFF2D4DC)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                key: const ValueKey('gate0-safety-ledger-icon'),
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFF0F766E),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.admin_panel_settings_outlined,
                    color: Color(0xFFFFFFFF)),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Safety Ledger',
                        key: ValueKey('gate0-safety-ledger-title'),
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.w700)),
                    Text('Raw LINE stays hidden',
                        key: ValueKey('gate0-safety-ledger-subtitle'),
                        style: TextStyle(color: Color(0xFF475569))),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          SafetyLedgerRow(
            key: const ValueKey('gate0-contact-cards-summary-row'),
            titleKey: const ValueKey('gate0-contact-cards-summary-title'),
            detailKey: const ValueKey('gate0-contact-cards-summary-detail'),
            icon: Icons.credit_card_off_outlined,
            title: 'Contact cards',
            detail: contactCardsDetail,
          ),
          if (contactCardState == Gate0ContactCardState.locked) ...[
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerLeft,
              child: OutlinedButton.icon(
                key: const ValueKey('gate0-start-contact-cards-from-summary'),
                onPressed: onOpenShareFlow,
                icon: const Icon(Icons.chat_bubble_outline),
                label: const Text('Start Contact Cards',
                    key: ValueKey(
                        'gate0-start-contact-cards-from-summary-label')),
              ),
            ),
          ],
          if (canReviewContactCard) ...[
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerLeft,
              child: OutlinedButton.icon(
                key: const ValueKey('gate0-review-contact-cards-from-summary'),
                onPressed: onOpenCurrentContactCard,
                icon: const Icon(Icons.rate_review_outlined),
                label: const Text('Review Contact Cards',
                    key: ValueKey(
                        'gate0-review-contact-cards-from-summary-label')),
              ),
            ),
          ],
          if (canReviewContactCard &&
              !hasContactReportEvent &&
              !hasContactBlockEvent) ...[
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerLeft,
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  OutlinedButton.icon(
                    key: const ValueKey(
                        'gate0-report-contact-cards-from-summary'),
                    onPressed: () => onSelectContactCardState(
                        Gate0ContactCardState.reported),
                    icon: const Icon(Icons.report_outlined),
                    label: const Text('Report Contact Cards',
                        key: ValueKey(
                            'gate0-report-contact-cards-from-summary-label')),
                  ),
                  OutlinedButton.icon(
                    key: const ValueKey(
                        'gate0-block-contact-cards-from-summary'),
                    onPressed: () =>
                        onSelectContactCardState(Gate0ContactCardState.blocked),
                    icon: const Icon(Icons.block_outlined),
                    label: const Text('Block Contact Cards',
                        key: ValueKey(
                            'gate0-block-contact-cards-from-summary-label')),
                  ),
                ],
              ),
            ),
          ],
          if (contactCardState ==
              Gate0ContactCardState.providerUnavailable) ...[
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerLeft,
              child: OutlinedButton.icon(
                key: const ValueKey('gate0-retry-contact-cards-from-summary'),
                onPressed: () =>
                    onSelectContactCardState(Gate0ContactCardState.available),
                icon: const Icon(Icons.refresh_outlined),
                label: const Text(
                  'Retry Contact Cards',
                  key: ValueKey('gate0-retry-contact-cards-from-summary-label'),
                ),
              ),
            ),
          ],
          if (contactCardState == Gate0ContactCardState.revoked) ...[
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerLeft,
              child: OutlinedButton.icon(
                key: const ValueKey(
                    'gate0-review-contact-cards-again-from-summary'),
                onPressed: onReviewRevokedContactCard,
                icon: const Icon(Icons.rate_review_outlined),
                label: const Text(
                  'Review sharing again',
                  key: ValueKey(
                    'gate0-review-contact-cards-again-from-summary-label',
                  ),
                ),
              ),
            ),
          ],
          const Divider(height: 20),
          SafetyLedgerRow(
            key: const ValueKey('gate0-public-id-summary-row'),
            titleKey: const ValueKey('gate0-public-id-summary-title'),
            detailKey: const ValueKey('gate0-public-id-summary-detail'),
            icon: publicIdsIcon,
            title: 'Public IDs',
            detail: publicIdsDetail,
          ),
          if (hasPublicIdEvents) ...[
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerLeft,
              child: OutlinedButton.icon(
                key: const ValueKey('gate0-manage-public-ids-from-summary'),
                onPressed: onOpenPublicIdManager,
                icon: const Icon(Icons.manage_accounts_outlined),
                label: const Text(
                  'Manage Public ID',
                  key: ValueKey(
                    'gate0-manage-public-ids-from-summary-label',
                  ),
                ),
              ),
            ),
          ],
          const Divider(height: 20),
          SafetyLedgerRow(
            key: const ValueKey('gate0-current-contact-card-row'),
            titleKey: const ValueKey('gate0-current-contact-card-title'),
            detailKey: const ValueKey('gate0-current-contact-card-detail'),
            icon: contactCardState.currentLedgerIcon,
            title: 'Current Contact Card',
            detail: contactCardState.currentLedgerDetail,
          ),
          if (contactCardState == Gate0ContactCardState.locked) ...[
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerLeft,
              child: OutlinedButton.icon(
                key: const ValueKey('gate0-start-contact-card-from-summary'),
                onPressed: onOpenShareFlow,
                icon: const Icon(Icons.chat_bubble_outline),
                label: const Text(
                  'Start Contact Card',
                  key: ValueKey('gate0-start-contact-card-from-summary-label'),
                ),
              ),
            ),
          ],
          if (canReviewContactCard) ...[
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerLeft,
              child: OutlinedButton.icon(
                key: const ValueKey(
                    'gate0-review-current-contact-card-from-summary'),
                onPressed: onOpenCurrentContactCard,
                icon: const Icon(Icons.rate_review_outlined),
                label: const Text(
                  'Review Current Card',
                  key: ValueKey(
                    'gate0-review-current-contact-card-from-summary-label',
                  ),
                ),
              ),
            ),
          ],
          if (contactCardState ==
              Gate0ContactCardState.providerUnavailable) ...[
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerLeft,
              child: OutlinedButton.icon(
                key: const ValueKey(
                    'gate0-retry-current-contact-card-from-summary'),
                onPressed: () =>
                    onSelectContactCardState(Gate0ContactCardState.available),
                icon: const Icon(Icons.refresh_outlined),
                label: const Text(
                  'Retry Current Card',
                  key: ValueKey(
                    'gate0-retry-current-contact-card-from-summary-label',
                  ),
                ),
              ),
            ),
          ],
          if (contactCardState == Gate0ContactCardState.revoked) ...[
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerLeft,
              child: OutlinedButton.icon(
                key: const ValueKey('gate0-review-sharing-again-from-summary'),
                onPressed: onReviewRevokedContactCard,
                icon: const Icon(Icons.rate_review_outlined),
                label: const Text(
                  'Review sharing again',
                  key:
                      ValueKey('gate0-review-sharing-again-from-summary-label'),
                ),
              ),
            ),
          ],
          const Divider(height: 20),
          SafetyLedgerRow(
            key: const ValueKey('gate0-reports-summary-row'),
            titleKey: const ValueKey('gate0-reports-summary-title'),
            detailKey: const ValueKey('gate0-reports-summary-detail'),
            icon: Icons.report_gmailerrorred_outlined,
            title: 'Reports',
            detail: reportDetail,
          ),
          if (hasContactReportEvent && !hasContactBlockEvent) ...[
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerLeft,
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  OutlinedButton.icon(
                    key: const ValueKey('gate0-review-reports-from-summary'),
                    onPressed: onOpenCurrentContactCard,
                    icon: const Icon(Icons.rate_review_outlined),
                    label: const Text(
                      'Review Reports',
                      key: ValueKey('gate0-review-reports-from-summary-label'),
                    ),
                  ),
                  OutlinedButton.icon(
                    key: const ValueKey('gate0-close-reports-from-summary'),
                    onPressed: onCloseReportReview,
                    icon: const Icon(Icons.check_circle_outline),
                    label: const Text(
                      'Close Reports',
                      key: ValueKey('gate0-close-reports-from-summary-label'),
                    ),
                  ),
                ],
              ),
            ),
          ],
          if (contactReportClosedNotice && !hasContactReportEvent) ...[
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerLeft,
              child: OutlinedButton.icon(
                key: const ValueKey('gate0-reopen-reports-from-summary'),
                onPressed: onReopenReportReview,
                icon: const Icon(Icons.rate_review_outlined),
                label: const Text(
                  'Reopen Reports',
                  key: ValueKey('gate0-reopen-reports-from-summary-label'),
                ),
              ),
            ),
          ],
          if (hasContactReportEvent && !hasContactBlockEvent) ...[
            const Divider(height: 20),
            Column(
              key: const ValueKey('gate0-reported-contacts-row'),
              children: [
                const SafetyLedgerRow(
                  key: ValueKey('gate0-reported-contacts-summary-row'),
                  icon: Icons.report_gmailerrorred_outlined,
                  title: 'Reported contacts',
                  detail: 'Safety review keeps LINE hidden',
                ),
                const Divider(height: 20),
                KeyedSubtree(
                  key: const ValueKey('gate0-current-reported-user-row'),
                  child: SafetyLedgerRow(
                    key: ValueKey(
                        'gate0-reported-user-${safetyProfile.publicIdentityId}'),
                    icon: Icons.person_search_outlined,
                    title:
                        '${safetyProfile.displayName} reported for Contact Card',
                    detail: '${safetyProfile.publicId} under review',
                  ),
                ),
                const SizedBox(height: 12),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      OutlinedButton.icon(
                        key: const ValueKey('gate0-review-reported-user'),
                        onPressed: onOpenCurrentContactCard,
                        icon: const Icon(Icons.rate_review_outlined),
                        label: const Text(
                          'Review reported user',
                          key: ValueKey('gate0-review-reported-user-label'),
                        ),
                      ),
                      OutlinedButton.icon(
                        key: const ValueKey('gate0-block-reported-user'),
                        onPressed: () => onSelectContactCardState(
                            Gate0ContactCardState.blocked),
                        icon: const Icon(Icons.block_outlined),
                        label: const Text(
                          'Block reported user',
                          key: ValueKey('gate0-block-reported-user-label'),
                        ),
                      ),
                      OutlinedButton.icon(
                        key: const ValueKey('gate0-close-report-review'),
                        onPressed: onCloseReportReview,
                        icon: const Icon(Icons.check_circle_outline),
                        label: const Text(
                          'Close report review',
                          key: ValueKey('gate0-close-report-review-label'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
          const Divider(height: 20),
          SafetyLedgerRow(
            key: const ValueKey('gate0-blocks-summary-row'),
            titleKey: const ValueKey('gate0-blocks-summary-title'),
            detailKey: const ValueKey('gate0-blocks-summary-detail'),
            icon: Icons.block_outlined,
            title: 'Blocks',
            detail: blockDetail,
          ),
          if (hasContactBlockEvent) ...[
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerLeft,
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  OutlinedButton.icon(
                    key: const ValueKey('gate0-review-blocks-from-summary'),
                    onPressed: onOpenCurrentContactCard,
                    icon: const Icon(Icons.rate_review_outlined),
                    label: const Text(
                      'Review Blocks',
                      key: ValueKey('gate0-review-blocks-from-summary-label'),
                    ),
                  ),
                  OutlinedButton.icon(
                    key: const ValueKey('gate0-unblock-from-summary'),
                    onPressed: onUnblockContactCard,
                    icon: const Icon(Icons.lock_open_outlined),
                    label: const Text(
                      'Unblock Contact',
                      key: ValueKey('gate0-unblock-from-summary-label'),
                    ),
                  ),
                ],
              ),
            ),
          ],
          if (contactReportClosedNotice && !hasContactReportEvent) ...[
            const Divider(height: 20),
            const SafetyLedgerRow(
              key: ValueKey('gate0-report-closed-notice'),
              icon: Icons.check_circle_outline,
              title: 'Report review closed',
              detail: 'Contact Card locked until you share again',
            ),
          ],
          ..._buildRetainedHistoryRows(
            hasReportHistory: hasReportHistory,
            hasBlockHistory: hasBlockHistory,
          ),
          if (hasContactBlockEvent) ...[
            const Divider(height: 20),
            Column(
              key: const ValueKey('gate0-blocked-users-row'),
              children: [
                const SafetyLedgerRow(
                  key: ValueKey('gate0-blocked-users-summary-row'),
                  icon: Icons.block_outlined,
                  title: 'Blocked users',
                  detail: 'LINE cannot reopen while blocked',
                ),
                const Divider(height: 20),
                KeyedSubtree(
                  key: const ValueKey('gate0-current-blocked-user-row'),
                  child: SafetyLedgerRow(
                    key: ValueKey(
                        'gate0-blocked-user-${safetyProfile.publicIdentityId}'),
                    icon: Icons.person_off_outlined,
                    title:
                        '${safetyProfile.displayName} blocked from Contact Card',
                    detail: '${safetyProfile.publicId} blocked',
                  ),
                ),
                const SizedBox(height: 12),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      OutlinedButton.icon(
                        key: const ValueKey('gate0-review-blocked-user'),
                        onPressed: onOpenCurrentContactCard,
                        icon: const Icon(Icons.rate_review_outlined),
                        label: const Text(
                          'Review blocked user',
                          key: ValueKey('gate0-review-blocked-user-label'),
                        ),
                      ),
                      OutlinedButton.icon(
                        key: const ValueKey('gate0-unblock-user'),
                        onPressed: onUnblockContactCard,
                        icon: const Icon(Icons.lock_open_outlined),
                        label: const Text(
                          'Unblock user',
                          key: ValueKey('gate0-unblock-user-label'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
          if (contactBlockRemovedNotice && !hasContactBlockEvent) ...[
            const Divider(height: 20),
            SafetyLedgerRow(
              key: const ValueKey('gate0-unblocked-user-notice'),
              icon: Icons.lock_open_outlined,
              title: 'Block removed',
              detail: hasContactReportEvent
                  ? 'Report review still active'
                  : 'Contact Card locked until you share again',
            ),
          ],
          if (publicIdShared) ...[
            const Divider(height: 20),
            Column(
              key: const ValueKey('gate0-shared-public-id-row'),
              children: [
                const SafetyLedgerRow(
                  key: ValueKey('gate0-current-shared-public-id-summary-row'),
                  icon: Icons.ios_share_outlined,
                  title: 'Current shared Public ID',
                  detail: 'Raw LINE still separate',
                  titleKey:
                      ValueKey('gate0-current-shared-public-id-summary-title'),
                  detailKey:
                      ValueKey('gate0-current-shared-public-id-summary-detail'),
                ),
                const Divider(height: 20),
                SafetyLedgerRow(
                  key: const ValueKey(
                      'gate0-current-shared-public-id-value-row'),
                  icon: Icons.badge_outlined,
                  title: currentPublicId,
                  detail: '$currentPublicId shared',
                  titleKey: const ValueKey(
                      'gate0-current-shared-public-id-value-title'),
                  detailKey: const ValueKey(
                      'gate0-current-shared-public-id-value-detail'),
                ),
                const SizedBox(height: 12),
                Align(
                  alignment: Alignment.centerLeft,
                  child: OutlinedButton.icon(
                    key: const ValueKey('gate0-manage-shared-public-id'),
                    onPressed: onOpenPublicIdManager,
                    icon: const Icon(Icons.manage_accounts_outlined),
                    label: const Text(
                      'Manage Public ID',
                      key: ValueKey('gate0-manage-shared-public-id-label'),
                    ),
                  ),
                ),
              ],
            ),
          ],
          if (archivedPublicIds.isNotEmpty) ...[
            const Divider(height: 20),
            Column(
              key: const ValueKey('gate0-archived-public-id-row'),
              children: [
                SafetyLedgerRow(
                  key: const ValueKey('gate0-public-id-history-summary-row'),
                  icon: Icons.history_outlined,
                  title: 'Public ID history',
                  detail: archivedPublicIdDetail,
                  titleKey:
                      const ValueKey('gate0-public-id-history-summary-title'),
                  detailKey:
                      const ValueKey('gate0-public-id-history-summary-detail'),
                ),
                const Divider(height: 20),
                for (final archivedPublicId in recentArchivedPublicIds) ...[
                  KeyedSubtree(
                    key: archivedPublicId == recentArchivedPublicIds.first
                        ? const ValueKey('gate0-latest-archived-public-id-row')
                        : const ValueKey('gate0-older-archived-public-id-row'),
                    child: SafetyLedgerRow(
                      key: ValueKey(
                          'gate0-archived-public-id-$archivedPublicId'),
                      icon: Icons.archive_outlined,
                      title: sharedPublicIds.contains(archivedPublicId)
                          ? archivedPublicId == recentArchivedPublicIds.first
                              ? 'Latest shared archived Public ID'
                              : 'Shared archived Public ID'
                          : archivedPublicId == recentArchivedPublicIds.first
                              ? 'Latest archived Public ID'
                              : 'Archived Public ID',
                      detail: sharedPublicIds.contains(archivedPublicId)
                          ? '$archivedPublicId shared before archive'
                          : '$archivedPublicId archived',
                      titleKey:
                          archivedPublicId == recentArchivedPublicIds.first
                              ? const ValueKey(
                                  'gate0-latest-archived-public-id-title')
                              : const ValueKey(
                                  'gate0-older-archived-public-id-title'),
                      detailKey:
                          archivedPublicId == recentArchivedPublicIds.first
                              ? const ValueKey(
                                  'gate0-latest-archived-public-id-detail')
                              : const ValueKey(
                                  'gate0-older-archived-public-id-detail'),
                    ),
                  ),
                  const SizedBox(height: 12),
                  KeyedSubtree(
                    key: archivedPublicId == recentArchivedPublicIds.first
                        ? const ValueKey(
                            'gate0-latest-archived-public-id-manage-action')
                        : const ValueKey(
                            'gate0-older-archived-public-id-manage-action'),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: OutlinedButton.icon(
                        key: ValueKey(
                            'gate0-manage-archived-public-id-$archivedPublicId'),
                        onPressed: onOpenPublicIdManager,
                        icon: const Icon(Icons.manage_accounts_outlined),
                        label: Text(
                          'Manage Public ID',
                          key: archivedPublicId == recentArchivedPublicIds.first
                              ? const ValueKey(
                                  'gate0-latest-archived-public-id-manage-action-label')
                              : const ValueKey(
                                  'gate0-older-archived-public-id-manage-action-label'),
                        ),
                      ),
                    ),
                  ),
                  if (archivedPublicId != recentArchivedPublicIds.last)
                    const Divider(height: 20),
                ],
              ],
            ),
          ],
          if (contactSafetyEvents.isNotEmpty) ...[
            const Divider(height: 20),
            Column(
              key: const ValueKey('gate0-contact-safety-event-row'),
              children: [
                const SafetyLedgerRow(
                  key: ValueKey('gate0-contact-event-history-summary-row'),
                  icon: Icons.receipt_long_outlined,
                  title: 'Contact event history',
                  detail: 'Most recent first',
                  titleKey:
                      ValueKey('gate0-contact-event-history-summary-title'),
                  detailKey:
                      ValueKey('gate0-contact-event-history-summary-detail'),
                ),
                const Divider(height: 20),
                for (final event in recentContactSafetyEvents) ...[
                  KeyedSubtree(
                    key: event == recentContactSafetyEvents.first
                        ? const ValueKey(
                            'gate0-latest-contact-safety-event-row')
                        : const ValueKey(
                            'gate0-older-contact-safety-event-row'),
                    child: SafetyLedgerRow(
                      key:
                          ValueKey('gate0-contact-safety-event-${event.label}'),
                      icon: event.safetyLedgerIcon,
                      title: event.safetyLedgerTitle,
                      detail: event.safetyLedgerDetail,
                      titleKey: event == recentContactSafetyEvents.first
                          ? const ValueKey(
                              'gate0-latest-contact-safety-event-title')
                          : const ValueKey(
                              'gate0-older-contact-safety-event-title'),
                      detailKey: event == recentContactSafetyEvents.first
                          ? const ValueKey(
                              'gate0-latest-contact-safety-event-detail')
                          : const ValueKey(
                              'gate0-older-contact-safety-event-detail'),
                    ),
                  ),
                  if (event != recentContactSafetyEvents.last)
                    const Divider(height: 20),
                ],
              ],
            ),
          ],
          const SizedBox(height: 14),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              OutlinedButton.icon(
                key: const ValueKey('gate0-ledger-review-contact-card'),
                onPressed:
                    canReviewContactCard ? onOpenCurrentContactCard : null,
                icon: const Icon(Icons.rate_review_outlined),
                label: Text(
                    canReviewContactCard
                        ? contactCardReviewLabel
                        : 'Share first to review',
                    key: const ValueKey(
                        'gate0-ledger-review-contact-card-label')),
              ),
              if (!canReviewContactCard)
                OutlinedButton.icon(
                  key: const ValueKey('gate0-ledger-open-share'),
                  onPressed: onOpenShareFlow,
                  icon: const Icon(Icons.chat_bubble_outline),
                  label: const Text('Open Chat to Share',
                      key: ValueKey('gate0-ledger-open-share-label')),
                ),
              if (contactCardState == Gate0ContactCardState.providerUnavailable)
                OutlinedButton.icon(
                  key: const ValueKey('gate0-ledger-retry-contact-card'),
                  onPressed: () =>
                      onSelectContactCardState(Gate0ContactCardState.available),
                  icon: const Icon(Icons.refresh_outlined),
                  label: const Text('Retry Contact Card',
                      key: ValueKey('gate0-ledger-retry-contact-card-label')),
                ),
              if (contactCardState == Gate0ContactCardState.revoked)
                OutlinedButton.icon(
                  key: const ValueKey('gate0-ledger-review-share-again'),
                  onPressed: onReviewRevokedContactCard,
                  icon: const Icon(Icons.rate_review_outlined),
                  label: const Text('Review sharing again',
                      key: ValueKey('gate0-ledger-review-share-again-label')),
                ),
              OutlinedButton.icon(
                key: const ValueKey('gate0-ledger-report-action'),
                onPressed: hasContactReportEvent || hasContactBlockEvent
                    ? null
                    : contactReportClosedNotice
                        ? onReopenReportReview
                        : () => onSelectContactCardState(
                            Gate0ContactCardState.reported),
                icon: const Icon(Icons.report_outlined),
                label: Text(ledgerReportActionLabel,
                    key: const ValueKey('gate0-ledger-report-action-label')),
              ),
              OutlinedButton.icon(
                key: const ValueKey('gate0-ledger-block-action'),
                onPressed: hasContactBlockEvent
                    ? null
                    : () =>
                        onSelectContactCardState(Gate0ContactCardState.blocked),
                icon: const Icon(Icons.block_outlined),
                label: Text(ledgerBlockActionLabel,
                    key: const ValueKey('gate0-ledger-block-action-label')),
              ),
            ],
          ),
        ],
      ),
    );
  }

  List<Widget> _buildRetainedHistoryRows({
    required bool hasReportHistory,
    required bool hasBlockHistory,
  }) {
    return [
      if (hasReportHistory &&
          !hasContactReportEvent &&
          !hasContactBlockEvent) ...[
        const Divider(height: 20),
        Column(
          key: const ValueKey('gate0-closed-report-retained-row'),
          children: [
            const SafetyLedgerRow(
              key: ValueKey('gate0-closed-report-retained-summary-row'),
              icon: Icons.history_toggle_off_outlined,
              title: 'Closed report retained',
              detail: 'Past report remains in event history',
            ),
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerLeft,
              child: OutlinedButton.icon(
                key: const ValueKey('gate0-reopen-report-review'),
                onPressed: onReopenReportReview,
                icon: const Icon(Icons.rate_review_outlined),
                label: const Text(
                  'Reopen report review',
                  key: ValueKey('gate0-reopen-report-review-label'),
                ),
              ),
            ),
          ],
        ),
      ],
      if (hasReportHistory && hasContactBlockEvent) ...[
        const Divider(height: 20),
        const SafetyLedgerRow(
          key: ValueKey('gate0-report-history-retained-row'),
          icon: Icons.history_toggle_off_outlined,
          title: 'Report history retained',
          detail: 'Block locks new report actions',
        ),
      ],
      if (hasBlockHistory && !hasContactBlockEvent) ...[
        const Divider(height: 20),
        const SafetyLedgerRow(
          key: ValueKey('gate0-block-history-retained-row'),
          icon: Icons.history_toggle_off_outlined,
          title: 'Block history retained',
          detail: 'Past block remains in event history',
        ),
      ],
    ];
  }
}

class SafetyLedgerRow extends StatelessWidget {
  const SafetyLedgerRow({
    required this.icon,
    required this.title,
    required this.detail,
    this.titleKey,
    this.detailKey,
    super.key,
  });

  final IconData icon;
  final String title;
  final String detail;
  final Key? titleKey;
  final Key? detailKey;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 22, color: const Color(0xFF0F766E)),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  key: titleKey,
                  style: const TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 2),
              Text(detail,
                  key: detailKey,
                  style: const TextStyle(color: Color(0xFF475569))),
            ],
          ),
        ),
      ],
    );
  }
}

class MyPublicMeetId extends StatelessWidget {
  const MyPublicMeetId({
    required this.user,
    required this.publicId,
    required this.archivedPublicId,
    required this.archivedPublicIdWasShared,
    required this.lineContactRegistered,
    required this.lineContactUpdated,
    required this.publicIdShared,
    required this.onRegeneratePublicId,
    required this.onSharePublicId,
    required this.onSetupLine,
    required this.onViewPublicIdHistory,
    super.key,
  });

  final Gate0PublicIdentity user;
  final String publicId;
  final String? archivedPublicId;
  final bool archivedPublicIdWasShared;
  final bool lineContactRegistered;
  final bool lineContactUpdated;
  final bool publicIdShared;
  final VoidCallback onRegeneratePublicId;
  final VoidCallback onSharePublicId;
  final VoidCallback onSetupLine;
  final VoidCallback onViewPublicIdHistory;

  @override
  Widget build(BuildContext context) {
    return Gate0ScreenFrame(
      title: 'My',
      titleKey: const ValueKey('gate0-my-screen-title'),
      subtitle: 'Your Public Meet ID is active.',
      subtitleKey: const ValueKey('gate0-my-screen-subtitle'),
      children: [
        PublicIdControlCard(
          user: user,
          publicId: publicId,
          archivedPublicId: archivedPublicId,
          archivedPublicIdWasShared: archivedPublicIdWasShared,
          lineContactRegistered: lineContactRegistered,
          lineContactUpdated: lineContactUpdated,
          publicIdShared: publicIdShared,
          onRegeneratePublicId: onRegeneratePublicId,
          onSharePublicId: onSharePublicId,
          onSetupLine: onSetupLine,
          onViewPublicIdHistory: onViewPublicIdHistory,
        ),
      ],
    );
  }
}

class PublicIdControlCard extends StatelessWidget {
  const PublicIdControlCard({
    required this.user,
    required this.publicId,
    required this.archivedPublicId,
    required this.archivedPublicIdWasShared,
    required this.lineContactRegistered,
    required this.lineContactUpdated,
    required this.publicIdShared,
    required this.onRegeneratePublicId,
    required this.onSharePublicId,
    required this.onSetupLine,
    required this.onViewPublicIdHistory,
    super.key,
  });

  final Gate0PublicIdentity user;
  final String publicId;
  final String? archivedPublicId;
  final bool archivedPublicIdWasShared;
  final bool lineContactRegistered;
  final bool lineContactUpdated;
  final bool publicIdShared;
  final VoidCallback onRegeneratePublicId;
  final VoidCallback onSharePublicId;
  final VoidCallback onSetupLine;
  final VoidCallback onViewPublicIdHistory;

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('gate0-public-id-card'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        border: Border.all(color: const Color(0xFFF2D4DC)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFFBE123C),
                  borderRadius: BorderRadius.circular(12),
                ),
                child:
                    const Icon(Icons.badge_outlined, color: Color(0xFFFFFFFF)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Public Meet ID',
                        key: ValueKey('gate0-public-id-title'),
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.w700)),
                    Text(publicId,
                        key: const ValueKey('gate0-public-id-current-value'),
                        style: const TextStyle(
                            color: Color(0xFFBE123C),
                            fontFamily: 'monospace',
                            fontWeight: FontWeight.w700)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              const ProfileStatusChip(
                  key: ValueKey('gate0-public-id-active-chip'),
                  icon: Icons.verified_outlined,
                  labelKey: ValueKey('gate0-public-id-active-label'),
                  label: 'Active now'),
              ProfileStatusChip(
                  key: const ValueKey('gate0-public-id-line-status-chip'),
                  icon: Icons.visibility_off_outlined,
                  labelKey: const ValueKey('gate0-public-id-line-status-label'),
                  label:
                      lineContactRegistered ? 'LINE ready' : 'LINE not set up'),
            ],
          ),
          const SizedBox(height: 12),
          const Text('History starts after regeneration',
              key: ValueKey('gate0-public-id-history-title'),
              style: TextStyle(fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          const Text(
            'Your private LINE stays separate from this public identity.',
            key: ValueKey('gate0-public-id-privacy-copy'),
          ),
          if (lineContactUpdated) ...[
            const SizedBox(height: 12),
            const LineUpdateNotice(),
          ],
          if (publicIdShared) ...[
            const SizedBox(height: 12),
            PublicIdShareNotice(
              publicId: publicId,
              onViewHistory: onViewPublicIdHistory,
            ),
          ],
          if (archivedPublicId != null) ...[
            const SizedBox(height: 12),
            Container(
              key: const ValueKey('gate0-public-id-archive-notice'),
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                border: Border.all(color: const Color(0xFFD7ECE8)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.archive_outlined,
                          color: Color(0xFF0F766E), size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          archivedPublicIdWasShared
                              ? '$archivedPublicId shared before archive'
                              : '$archivedPublicId archived',
                          key: const ValueKey(
                              'gate0-public-id-archive-notice-title'),
                          style: const TextStyle(fontWeight: FontWeight.w700),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    archivedPublicIdWasShared
                        ? 'Previous shared ID archived'
                        : 'Previous ID archived',
                    key:
                        const ValueKey('gate0-public-id-archive-notice-detail'),
                    style: const TextStyle(color: Color(0xFF475569)),
                  ),
                  const SizedBox(height: 8),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: TextButton.icon(
                      key: const ValueKey('gate0-view-public-id-history'),
                      onPressed: onViewPublicIdHistory,
                      icon: const Icon(Icons.history_outlined),
                      label: const Text(
                        'View history',
                        key: ValueKey('gate0-view-public-id-history-label'),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
          const SizedBox(height: 14),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              OutlinedButton.icon(
                key: const ValueKey('gate0-regenerate-public-id'),
                onPressed: onRegeneratePublicId,
                icon: const Icon(Icons.autorenew),
                label: const Text(
                  'Regenerate Public ID',
                  key: ValueKey('gate0-regenerate-public-id-label'),
                ),
              ),
              FilledButton.icon(
                key: const ValueKey('gate0-line-setup-in-my'),
                onPressed: onSetupLine,
                icon: const Icon(Icons.chat_bubble_outline),
                label: Text(
                  lineContactRegistered ? 'Update LINE' : 'Set up LINE',
                  key: const ValueKey('gate0-line-setup-in-my-label'),
                ),
              ),
              OutlinedButton.icon(
                key: const ValueKey('gate0-share-public-id'),
                onPressed: onSharePublicId,
                icon: const Icon(Icons.ios_share_outlined),
                label: const Text(
                  'Share Public ID',
                  key: ValueKey('gate0-share-public-id-label'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class LineUpdateNotice extends StatelessWidget {
  const LineUpdateNotice({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('gate0-line-update-notice'),
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDFA),
        border: Border.all(color: const Color(0xFF99F6E4)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.check_circle_outline, color: Color(0xFF0F766E), size: 20),
          SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('LINE updated just now',
                    key: ValueKey('gate0-line-update-notice-title'),
                    style: TextStyle(fontWeight: FontWeight.w700)),
                SizedBox(height: 2),
                Text('Raw LINE still separate',
                    key: ValueKey('gate0-line-update-notice-privacy'),
                    style: TextStyle(color: Color(0xFF475569))),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class PublicIdShareNotice extends StatelessWidget {
  const PublicIdShareNotice({
    required this.publicId,
    required this.onViewHistory,
    super.key,
  });

  final String publicId;
  final VoidCallback onViewHistory;

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('gate0-public-id-share-notice'),
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        border: Border.all(color: const Color(0xFFD7ECE8)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.ios_share_outlined,
              color: Color(0xFF0F766E), size: 20),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Public ID shared just now',
                  key: ValueKey('gate0-public-id-share-notice-title'),
                  style: TextStyle(fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 2),
                Text(
                  '$publicId shared',
                  key: const ValueKey('gate0-public-id-share-notice-detail'),
                  style: const TextStyle(color: Color(0xFF475569)),
                ),
                const SizedBox(height: 2),
                const Text(
                  'Raw LINE still separate',
                  key: ValueKey('gate0-public-id-share-notice-privacy'),
                  style: TextStyle(color: Color(0xFF475569)),
                ),
                const SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerLeft,
                  child: TextButton.icon(
                    key: const ValueKey('gate0-view-shared-public-id-history'),
                    onPressed: onViewHistory,
                    icon: const Icon(Icons.history_outlined),
                    label: const Text(
                      'View in List',
                      key: ValueKey(
                        'gate0-view-shared-public-id-history-label',
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class Gate0ScreenFrame extends StatelessWidget {
  const Gate0ScreenFrame({
    required this.title,
    required this.subtitle,
    required this.children,
    this.titleKey,
    this.subtitleKey,
    super.key,
  });

  final String title;
  final String subtitle;
  final List<Widget> children;
  final Key? titleKey;
  final Key? subtitleKey;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(title,
            key: titleKey, style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 4),
        Text(subtitle,
            key: subtitleKey, style: Theme.of(context).textTheme.bodyMedium),
        const SizedBox(height: 16),
        ...children,
      ],
    );
  }
}

class ProfileCard extends StatelessWidget {
  const ProfileCard(
      {required this.profile, required this.onOpenProfileDetail, super.key});

  final Gate0DiscoverProfile profile;
  final VoidCallback onOpenProfileDetail;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        border: Border.all(color: const Color(0xFFF2D4DC)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ProfileVisual(profile: profile),
          const SizedBox(height: 16),
          Text('${profile.displayName}, ${profile.age}',
              key: const ValueKey('gate0-profile-card-name'),
              style:
                  const TextStyle(fontSize: 26, fontWeight: FontWeight.w700)),
          Text('${profile.city} - ${profile.distanceLabel}',
              key: const ValueKey('gate0-profile-card-location')),
          const SizedBox(height: 8),
          const Text(
            'Profile opens before chat. LINE sharing starts only after you choose it.',
            key: ValueKey('gate0-profile-card-privacy-copy'),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            key: const ValueKey('gate0-open-profile-detail'),
            onPressed: onOpenProfileDetail,
            icon: const Icon(Icons.person_search),
            label: const Text(
              'View Profile',
              key: ValueKey('gate0-open-profile-detail-label'),
            ),
          ),
        ],
      ),
    );
  }
}

class ProfileVisual extends StatelessWidget {
  const ProfileVisual({required this.profile, super.key});

  final Gate0DiscoverProfile profile;
  String get nearbyLabel =>
      '${profile.distanceLabel.replaceAll(' away', '')} nearby';

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('gate0-profile-visual'),
      height: 132,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFFF7FBFA),
        border: Border.all(color: const Color(0xFFD7ECE8)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              PublicIdBadge(publicId: profile.publicId),
              const Spacer(),
              const SizedBox(
                width: 124,
                child: ProfileStatusChip(
                  key: ValueKey('gate0-profile-visual-line-off-chip'),
                  icon: Icons.visibility_off_outlined,
                  labelKey: ValueKey('gate0-profile-visual-line-off-label'),
                  label: 'LINE off',
                ),
              ),
            ],
          ),
          const Spacer(),
          Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: const Color(0xFF0F766E),
                child: Text(
                  profile.displayName.characters.first,
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.w700),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Public profile',
                        key: ValueKey('gate0-profile-visual-title'),
                        style: TextStyle(fontWeight: FontWeight.w700)),
                    Text('${profile.city} · $nearbyLabel',
                        key: const ValueKey('gate0-profile-visual-location')),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class ProfileStatusChip extends StatelessWidget {
  const ProfileStatusChip(
      {required this.icon, required this.label, this.labelKey, super.key});

  final IconData icon;
  final String label;
  final Key? labelKey;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final maxChipWidth =
            constraints.hasBoundedWidth ? constraints.maxWidth : 280.0;

        return ConstrainedBox(
          constraints: BoxConstraints(maxWidth: maxChipWidth),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFFFFFFF),
              border: Border.all(color: const Color(0xFFD7ECE8)),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(icon, size: 16, color: const Color(0xFF0F766E)),
                const SizedBox(width: 4),
                Flexible(
                  child: Text(label,
                      key: labelKey,
                      softWrap: true,
                      style: const TextStyle(
                          fontSize: 12, fontWeight: FontWeight.w600)),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class ProfileSummary extends StatelessWidget {
  const ProfileSummary({
    required this.profile,
    required this.hasContactReportEvent,
    required this.hasContactBlockEvent,
    required this.onSelectContactCardState,
    super.key,
  });

  final Gate0DiscoverProfile profile;
  final bool hasContactReportEvent;
  final bool hasContactBlockEvent;
  final ValueChanged<Gate0ContactCardState> onSelectContactCardState;

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('gate0-profile-trust-card'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        border: Border.all(color: const Color(0xFFF2D4DC)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: const Color(0xFF0F766E),
                child: Text(
                  profile.displayName.characters.first,
                  key: const ValueKey('gate0-profile-trust-avatar-initial'),
                  style: const TextStyle(
                      color: Color(0xFFFFFFFF),
                      fontSize: 24,
                      fontWeight: FontWeight.w700),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Profile Trust Check',
                        key: ValueKey('gate0-profile-trust-title'),
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.w700)),
                    Text('${profile.displayName}, ${profile.age}',
                        key: const ValueKey('gate0-profile-trust-name')),
                  ],
                ),
              ),
              PublicIdBadge(
                  publicId: profile.publicId,
                  labelKey: const ValueKey('gate0-profile-trust-public-id')),
            ],
          ),
          const SizedBox(height: 14),
          const Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ProfileStatusChip(
                  key: ValueKey('gate0-profile-public-id-verified-chip'),
                  icon: Icons.verified_user_outlined,
                  labelKey: ValueKey('gate0-profile-public-id-verified-label'),
                  label: 'Public ID verified'),
              ProfileStatusChip(
                  key: ValueKey('gate0-profile-line-hidden-chip'),
                  icon: Icons.visibility_off_outlined,
                  labelKey: ValueKey('gate0-profile-line-hidden-label'),
                  label: 'LINE hidden before chat'),
            ],
          ),
          const SizedBox(height: 12),
          Text('${profile.city} - ${profile.distanceLabel}',
              key: const ValueKey('gate0-profile-trust-location')),
          const SizedBox(height: 6),
          const Text('Report or block before starting chat',
              key: ValueKey('gate0-profile-safety-copy')),
          const SizedBox(height: 14),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              OutlinedButton.icon(
                key: const ValueKey('gate0-profile-report-action'),
                onPressed: hasContactReportEvent || hasContactBlockEvent
                    ? null
                    : () => onSelectContactCardState(
                        Gate0ContactCardState.reported),
                icon: const Icon(Icons.report_outlined),
                label: Text(
                  hasContactReportEvent
                      ? 'Report logged'
                      : hasContactBlockEvent
                          ? 'Report locked'
                          : 'Report',
                  key: const ValueKey('gate0-profile-report-action-label'),
                ),
              ),
              OutlinedButton.icon(
                key: const ValueKey('gate0-profile-block-action'),
                onPressed: hasContactBlockEvent
                    ? null
                    : () =>
                        onSelectContactCardState(Gate0ContactCardState.blocked),
                icon: const Icon(Icons.block_outlined),
                label: Text(
                  hasContactBlockEvent ? 'Block active' : 'Block',
                  key: const ValueKey('gate0-profile-block-action-label'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class QuickMessageBox extends StatelessWidget {
  const QuickMessageBox({super.key});

  @override
  Widget build(BuildContext context) {
    return const TextField(
      enabled: false,
      decoration: InputDecoration(
        border: OutlineInputBorder(),
        hintText: 'Send a quick message',
      ),
    );
  }
}

class ChatBubble extends StatelessWidget {
  const ChatBubble({required this.messageId, required this.text, super.key});

  final String messageId;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      key: ValueKey('gate0-chat-message-$messageId'),
      padding: const EdgeInsets.only(bottom: 8),
      child: Align(
        alignment: Alignment.centerLeft,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: const Color(0xFFFFFFFF),
            border: Border.all(color: const Color(0xFFF2D4DC)),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Text(
              text,
              key: ValueKey('gate0-chat-message-text-$messageId'),
            ),
          ),
        ),
      ),
    );
  }
}

class TrustPanel extends StatelessWidget {
  const TrustPanel({
    required this.title,
    required this.body,
    required this.actions,
    this.titleKey,
    this.bodyKey,
    this.footer,
    super.key,
  });

  final String title;
  final String body;
  final List<PanelAction> actions;
  final Key? titleKey;
  final Key? bodyKey;
  final Widget? footer;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        border: Border.all(color: const Color(0xFFF2D4DC)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              key: titleKey,
              style: const TextStyle(fontWeight: FontWeight.w700)),
          const SizedBox(height: 6),
          Text(body, key: bodyKey),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final action in actions)
                OutlinedButton(
                  key: action.key,
                  onPressed: action.onPressed,
                  child: Text(action.label, key: action.labelKey),
                ),
            ],
          ),
          if (footer != null) ...[
            const SizedBox(height: 12),
            footer!,
          ],
        ],
      ),
    );
  }
}

class PanelAction {
  const PanelAction({
    required this.label,
    this.key,
    this.labelKey,
    this.onPressed,
  });

  final Key? key;
  final Key? labelKey;
  final String label;
  final VoidCallback? onPressed;
}

class PublicIdBadge extends StatelessWidget {
  const PublicIdBadge({required this.publicId, this.labelKey, super.key});

  final String publicId;
  final Key? labelKey;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: const Color(0xFFBE123C),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        child: Text(
          publicId,
          key: labelKey,
          style: const TextStyle(
            color: Colors.white,
            fontFamily: 'monospace',
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}

extension Gate0ContactCardStateCopy on Gate0ContactCardState {
  bool get isSafetyLedgerEvent {
    return switch (this) {
      Gate0ContactCardState.revoked ||
      Gate0ContactCardState.reported ||
      Gate0ContactCardState.blocked ||
      Gate0ContactCardState.providerUnavailable =>
        true,
      Gate0ContactCardState.locked || Gate0ContactCardState.available => false,
    };
  }

  IconData get safetyLedgerIcon {
    return switch (this) {
      Gate0ContactCardState.revoked => Icons.undo_outlined,
      Gate0ContactCardState.reported => Icons.report_gmailerrorred_outlined,
      Gate0ContactCardState.blocked => Icons.block_outlined,
      Gate0ContactCardState.providerUnavailable => Icons.cloud_off_outlined,
      Gate0ContactCardState.locked ||
      Gate0ContactCardState.available =>
        Icons.verified_user_outlined,
    };
  }

  IconData get currentLedgerIcon {
    return switch (this) {
      Gate0ContactCardState.locked => Icons.lock_outline,
      _ => safetyLedgerIcon,
    };
  }

  String get safetyLedgerTitle {
    return switch (this) {
      Gate0ContactCardState.revoked => 'Contact Card revoked',
      Gate0ContactCardState.reported => 'Contact Card report',
      Gate0ContactCardState.blocked => 'Contact Card block',
      Gate0ContactCardState.providerUnavailable => 'Contact Card delayed',
      Gate0ContactCardState.locked ||
      Gate0ContactCardState.available =>
        'Contact Card state',
    };
  }

  String get safetyLedgerDetail {
    return switch (this) {
      Gate0ContactCardState.revoked => 'LINE contact revoked',
      Gate0ContactCardState.reported => 'LINE contact reported',
      Gate0ContactCardState.blocked => 'LINE contact blocked',
      Gate0ContactCardState.providerUnavailable => 'LINE provider unavailable',
      Gate0ContactCardState.locked ||
      Gate0ContactCardState.available =>
        'LINE contact guarded',
    };
  }

  String get shortLabel {
    return switch (this) {
      Gate0ContactCardState.locked => 'Locked',
      Gate0ContactCardState.available => 'Available',
      Gate0ContactCardState.revoked => 'Revoked',
      Gate0ContactCardState.reported => 'Reported',
      Gate0ContactCardState.blocked => 'Blocked',
      Gate0ContactCardState.providerUnavailable => 'Provider down',
    };
  }

  String get label {
    return switch (this) {
      Gate0ContactCardState.locked => 'locked',
      Gate0ContactCardState.available => 'available',
      Gate0ContactCardState.revoked => 'revoked',
      Gate0ContactCardState.reported => 'reported',
      Gate0ContactCardState.blocked => 'blocked',
      Gate0ContactCardState.providerUnavailable => 'providerUnavailable',
    };
  }

  String get description {
    return switch (this) {
      Gate0ContactCardState.locked =>
        'The card is locked until first-share confirmation.',
      Gate0ContactCardState.available =>
        'The card can be viewed, revoked, reported, or blocked.',
      Gate0ContactCardState.revoked =>
        'The card is no longer available, but chat history stays.',
      Gate0ContactCardState.reported =>
        'The safety review state is visible while LINE stays hidden.',
      Gate0ContactCardState.blocked =>
        'The card cannot be reopened after block.',
      Gate0ContactCardState.providerUnavailable =>
        'LINE cannot load now, so the user can retry later.',
    };
  }

  bool get canView => this == Gate0ContactCardState.available;
  bool get canRevoke => this == Gate0ContactCardState.available;
  bool get canReport =>
      this != Gate0ContactCardState.reported &&
      this != Gate0ContactCardState.blocked;
  bool get canBlock => this != Gate0ContactCardState.blocked;

  String get reportActionLabel {
    return switch (this) {
      Gate0ContactCardState.reported => 'Report logged',
      Gate0ContactCardState.blocked => 'Report locked',
      _ => 'Report',
    };
  }

  String get blockActionLabel {
    return this == Gate0ContactCardState.blocked ? 'Block active' : 'Block';
  }

  String get revokeActionLabel {
    return this == Gate0ContactCardState.revoked
        ? 'Contact Card revoked'
        : 'Revoke Contact Card';
  }

  String get viewActionLabel {
    return canView ? 'Preview visible' : 'View unavailable';
  }

  String get retryActionLabel {
    return this == Gate0ContactCardState.providerUnavailable
        ? 'Retry later'
        : 'Retry not needed';
  }

  String get currentLedgerDetail {
    return switch (this) {
      Gate0ContactCardState.locked => 'Share not started',
      Gate0ContactCardState.available => 'Shared by choice',
      Gate0ContactCardState.revoked => 'Revoked by you',
      Gate0ContactCardState.reported => 'Report under review',
      Gate0ContactCardState.blocked => 'Block stays active',
      Gate0ContactCardState.providerUnavailable => 'Provider unavailable now',
    };
  }

  String get ledgerReviewActionLabel {
    return switch (this) {
      Gate0ContactCardState.revoked => 'Review Revoked Card',
      Gate0ContactCardState.reported => 'Review Reported Card',
      Gate0ContactCardState.blocked => 'Review Blocked Card',
      Gate0ContactCardState.providerUnavailable => 'Review Delayed Card',
      Gate0ContactCardState.available => 'Review Shared Card',
      _ => 'Review Contact Card',
    };
  }

  String get ledgerReportActionLabel {
    return switch (this) {
      Gate0ContactCardState.available => 'Report Shared Card',
      Gate0ContactCardState.providerUnavailable => 'Report Delayed Card',
      Gate0ContactCardState.revoked => 'Report Revoked Card',
      _ => 'Report',
    };
  }

  String get ledgerBlockActionLabel {
    return switch (this) {
      Gate0ContactCardState.reported => 'Block Reported Card',
      Gate0ContactCardState.available => 'Block Shared Card',
      Gate0ContactCardState.providerUnavailable => 'Block Delayed Card',
      Gate0ContactCardState.revoked => 'Block Revoked Card',
      _ => 'Block',
    };
  }
}
