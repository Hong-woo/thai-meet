import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:thai_meet_mobile/main.dart';

void main() {
  testWidgets('Gate 0 shell exposes app bar identity markers', (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    expect(find.text('Thai Meet'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-shell-app-title')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-shell-public-id-badge')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-tab-discover-icon')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-tab-swipe-icon')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-tab-chat-icon')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-tab-list-icon')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-tab-my-icon')), findsOneWidget);
  });

  testWidgets(
      'Gate 0 Trust Loop reaches LINE Contact Card without raw LINE values',
      (tester) async {
    await openLineContactCard(tester);

    expect(find.byKey(const ValueKey('gate0-line-contact-card-panel')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-contact-card-panel-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-contact-card-panel-body')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-view-action')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-view-action-label')),
        findsOneWidget);
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-block')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('gate0-contact-block-label')),
        findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('gate0-contact-block')));
    await tester.pumpAndSettle();
    expect(find.textContaining('LINE contact blocked'), findsOneWidget);
    expect(find.text('Report locked'), findsOneWidget);
    expect(find.text('Block active'), findsOneWidget);
  });

  testWidgets('Gate 0 LINE Contact Card can be revoked from available state',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-revoke')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('gate0-contact-revoke-label')),
        findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('gate0-contact-revoke')));
    await tester.pumpAndSettle();

    expect(find.textContaining('LINE contact revoked'), findsOneWidget);
    expect(find.text('Contact Card revoked'), findsOneWidget);
  });

  testWidgets('Gate 0 revoked Contact Card shows unavailable protection',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-revoke')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-revoke')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-contact-state-alert')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-state-alert-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-state-alert-detail')),
        findsOneWidget);
    expect(
      find.byKey(const ValueKey('gate0-contact-state-alert-revoked-detail')),
      findsOneWidget,
    );
    expect(
        find.byKey(const ValueKey('gate0-contact-state-alert-revoked-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-state-alert-hidden-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-state-alert-hidden-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-state-alert-chat-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-state-alert-chat-label')),
        findsOneWidget);
    expect(find.text('Contact access unavailable'), findsOneWidget);
    expect(find.text('Contact Card revoked by you'), findsOneWidget);
    expect(find.text('Review sharing again to create a new card.'),
        findsOneWidget);
    expect(find.text('View unavailable'), findsOneWidget);
    expect(find.text('Raw LINE remains hidden'), findsOneWidget);
    expect(find.text('Chat stays open'), findsOneWidget);
  });

  testWidgets('Gate 0 revoked Contact Card can review sharing again',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-revoke')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-revoke')));
    await tester.pumpAndSettle();

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-review-share')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('gate0-contact-review-share-label')),
        findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('gate0-contact-review-share')));
    await tester.pumpAndSettle();

    expect(find.text('Share LINE?'), findsOneWidget);
    expect(find.text('Contact Card locked'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('gate0-share-line')));
    await tester.pumpAndSettle();

    expect(find.text('Preview visible'), findsOneWidget);
    expect(find.textContaining('LINE contact available'), findsOneWidget);
    expect(find.textContaining('LINE contact revoked'), findsNothing);
  });

  testWidgets('Gate 0 Contact Card state selector fits phone width',
      (tester) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });

    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-state-selector')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();

    expect(find.text('Provider down'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-state-locked-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-state-available-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-state-revoked-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-state-reported-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-state-blocked-label')),
        findsOneWidget);
    expect(
        find.byKey(
            const ValueKey('gate0-contact-state-providerUnavailable-label')),
        findsOneWidget);
  });

  testWidgets('Gate 0 LINE Contact Card can be reported from available state',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-report')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('gate0-contact-report-label')),
        findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('gate0-contact-report')));
    await tester.pumpAndSettle();

    expect(find.textContaining('LINE contact reported'), findsOneWidget);
    final reportAction = tester.widget<OutlinedButton>(
        find.byKey(const ValueKey('gate0-contact-report')));
    expect(reportAction.onPressed, isNull);
  });

  testWidgets('Gate 0 reported Contact Card explains review status',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-report')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-report')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-contact-state-alert')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-contact-state-alert-reported-title')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-contact-state-alert-reported-detail')),
        findsOneWidget);
    expect(find.text('Report under review'), findsOneWidget);
    expect(
        find.text('Chat stays open while safety reviews it.'), findsOneWidget);
    expect(find.text('Raw LINE remains hidden'), findsOneWidget);
  });

  testWidgets('Gate 0 blocked Contact Card explains that contact stays closed',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-block')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-block')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-contact-state-alert')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-contact-state-alert-blocked-title')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-contact-state-alert-blocked-detail')),
        findsOneWidget);
    expect(find.text('Block stays active'), findsOneWidget);
    expect(find.text('LINE cannot reopen from this chat.'), findsOneWidget);
    expect(find.text('Raw LINE remains hidden'), findsOneWidget);
  });

  testWidgets('Gate 0 List tab records Contact Card report event',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-report')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-report')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-contact-safety-event-row')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-contact-event-history-summary-row')),
        findsOneWidget);
    expect(find.text('1 safety contact event'), findsOneWidget);
    expect(find.text('1 recent contact event'), findsNothing);
    expect(find.byKey(const ValueKey('gate0-current-contact-card-row')),
        findsOneWidget);
    expect(find.text('Current Contact Card'), findsOneWidget);
    expect(find.text('Report under review'), findsOneWidget);
    expect(find.text('Reported now'), findsNothing);
    expect(find.byKey(const ValueKey('gate0-latest-contact-safety-event-row')),
        findsOneWidget);
    expect(find.text('Contact Card report'), findsOneWidget);
    expect(find.text('LINE contact reported'), findsOneWidget);
    expect(find.text('Report logged'), findsOneWidget);
    expect(find.text('Reported contacts'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-current-reported-user-row')),
        findsOneWidget);
    expect(find.text('Alex reported for Contact Card'), findsOneWidget);
    expect(find.text('Safety review keeps LINE hidden'), findsOneWidget);
    expect(find.text('Report history retained'), findsNothing);
    expect(find.text('Block locks new report actions'), findsNothing);

    final reportAction = tester.widget<OutlinedButton>(
        find.byKey(const ValueKey('gate0-ledger-report-action')));
    expect(reportAction.onPressed, isNull);
  });

  testWidgets(
      'Gate 0 List reported contacts action opens reported Contact Card',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-report-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-report-action')));
    await tester.pumpAndSettle();

    expect(find.text('Reported contacts'), findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-review-reported-user');
    expect(
      find.byKey(const ValueKey('gate0-review-reported-user-label')),
      findsOneWidget,
    );
    await tester.tap(find.byKey(const ValueKey('gate0-review-reported-user')));
    await tester.pumpAndSettle();

    expect(find.text('LINE Contact Card'), findsOneWidget);
    expect(find.text('Report under review'), findsOneWidget);
    expect(
        find.text('Chat stays open while safety reviews it.'), findsOneWidget);
  });

  testWidgets('Gate 0 List Reports summary opens reported Contact Card',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-report-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-report-action')));
    await tester.pumpAndSettle();

    expect(find.text('Reports'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-reports-summary-row')),
        findsOneWidget);
    expect(find.text('1 ready for review'), findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-review-reports-from-summary');
    expect(
      find.byKey(const ValueKey('gate0-review-reports-from-summary-label')),
      findsOneWidget,
    );
    await tester
        .tap(find.byKey(const ValueKey('gate0-review-reports-from-summary')));
    await tester.pumpAndSettle();

    expect(find.text('LINE Contact Card'), findsOneWidget);
    expect(find.text('Report under review'), findsOneWidget);
    expect(
        find.text('Chat stays open while safety reviews it.'), findsOneWidget);
  });

  testWidgets('Gate 0 List Reports summary closes report review safely',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-report-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-report-action')));
    await tester.pumpAndSettle();

    expect(find.text('1 ready for review'), findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-close-reports-from-summary');
    expect(
      find.byKey(const ValueKey('gate0-close-reports-from-summary-label')),
      findsOneWidget,
    );
    await tester
        .tap(find.byKey(const ValueKey('gate0-close-reports-from-summary')));
    await tester.pumpAndSettle();

    expect(find.text('Reported contacts'), findsNothing);
    expect(find.text('Report review closed'), findsOneWidget);
    expect(find.text('No reports pending'), findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-closed-report-retained-summary-row')),
        findsOneWidget);
    expect(find.text('Closed report retained'), findsOneWidget);
    expect(find.text('Past report remains in event history'), findsOneWidget);
  });

  testWidgets('Gate 0 List reported contacts can close review safely',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-report-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-report-action')));
    await tester.pumpAndSettle();

    expect(find.text('Reported contacts'), findsOneWidget);
    expect(find.text('1 ready for review'), findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-close-report-review');
    expect(
      find.byKey(const ValueKey('gate0-close-report-review-label')),
      findsOneWidget,
    );
    await tester.tap(find.byKey(const ValueKey('gate0-close-report-review')));
    await tester.pumpAndSettle();

    expect(find.text('Reported contacts'), findsNothing);
    expect(find.text('Report review closed'), findsOneWidget);
    expect(
        find.text('Contact Card locked until you share again'), findsOneWidget);
    expect(find.text('No reports pending'), findsOneWidget);
    expect(find.text('Closed report retained'), findsOneWidget);
    expect(find.text('Past report remains in event history'), findsOneWidget);
    expect(find.text('Share not started'), findsOneWidget);
    expect(find.text('1 safety contact event'), findsOneWidget);
    expect(find.text('Contact Card report'), findsOneWidget);
    expect(find.text('LINE contact reported'), findsOneWidget);
    expect(find.text('Open Chat to Share'), findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-reopen-report-review');
    expect(
      find.byKey(const ValueKey('gate0-reopen-report-review-label')),
      findsOneWidget,
    );
    await tester.tap(find.byKey(const ValueKey('gate0-reopen-report-review')));
    await tester.pumpAndSettle();

    expect(find.text('Report review closed'), findsNothing);
    expect(find.text('Closed report retained'), findsNothing);
    expect(find.text('Reported contacts'), findsOneWidget);
    expect(find.text('1 ready for review'), findsOneWidget);
    expect(find.text('Review Reported Card'), findsOneWidget);
  });

  testWidgets('Gate 0 List Reports summary reopens closed report review',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-report-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-report-action')));
    await tester.pumpAndSettle();

    await scrollToLedgerAction(tester, 'gate0-close-reports-from-summary');
    await tester
        .tap(find.byKey(const ValueKey('gate0-close-reports-from-summary')));
    await tester.pumpAndSettle();

    expect(find.text('Report review closed'), findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-reopen-reports-from-summary');
    expect(
      find.byKey(const ValueKey('gate0-reopen-reports-from-summary-label')),
      findsOneWidget,
    );
    await tester
        .tap(find.byKey(const ValueKey('gate0-reopen-reports-from-summary')));
    await tester.pumpAndSettle();

    expect(find.text('Report review closed'), findsNothing);
    expect(find.text('Closed report retained'), findsNothing);
    expect(find.text('Reported contacts'), findsOneWidget);
    expect(find.text('1 ready for review'), findsOneWidget);
    expect(find.text('Review Reports'), findsOneWidget);
  });

  testWidgets('Gate 0 List closed report action reopens review',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-report-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-report-action')));
    await tester.pumpAndSettle();

    await scrollToLedgerAction(tester, 'gate0-close-report-review');
    await tester.tap(find.byKey(const ValueKey('gate0-close-report-review')));
    await tester.pumpAndSettle();

    expect(find.text('Reopen Report'), findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-ledger-report-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-report-action')));
    await tester.pumpAndSettle();

    expect(find.text('Report review closed'), findsNothing);
    expect(find.text('Reported contacts'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-reported-contacts-summary-row')),
        findsOneWidget);
    expect(find.text('1 ready for review'), findsOneWidget);
    expect(find.text('1 safety contact event'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-safety-event-reported')),
        findsOneWidget);
    expect(find.text('Reopen Report'), findsNothing);
  });

  testWidgets('Gate 0 List closed report can be blocked', (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-report-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-report-action')));
    await tester.pumpAndSettle();

    await scrollToLedgerAction(tester, 'gate0-close-report-review');
    await tester.tap(find.byKey(const ValueKey('gate0-close-report-review')));
    await tester.pumpAndSettle();

    expect(find.text('Report review closed'), findsOneWidget);
    expect(find.text('Closed report retained'), findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-ledger-block-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-block-action')));
    await tester.pumpAndSettle();

    expect(find.text('Report review closed'), findsNothing);
    expect(find.text('Closed report retained'), findsNothing);
    expect(find.text('Report history retained'), findsOneWidget);
    expect(find.text('Block locks new report actions'), findsOneWidget);
    expect(find.text('Blocked users'), findsOneWidget);
    expect(find.text('1 active block'), findsOneWidget);
  });

  testWidgets('Gate 0 Chat share clears closed report notice', (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-report-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-report-action')));
    await tester.pumpAndSettle();

    await scrollToLedgerAction(tester, 'gate0-close-report-review');
    await tester.tap(find.byKey(const ValueKey('gate0-close-report-review')));
    await tester.pumpAndSettle();

    expect(find.text('Report review closed'), findsOneWidget);

    await tester.tap(find.text('Chat').last);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Share LINE'));
    await tester.pumpAndSettle();

    expect(find.text('LINE Contact Card'), findsOneWidget);

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Report review closed'), findsNothing);
    expect(find.text('Current Contact Card'), findsOneWidget);
    expect(find.text('Shared by choice'), findsOneWidget);
  });

  testWidgets('Gate 0 List reported contacts can be blocked', (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-report-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-report-action')));
    await tester.pumpAndSettle();

    expect(find.text('Reported contacts'), findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-block-reported-user');
    expect(
      find.byKey(const ValueKey('gate0-block-reported-user-label')),
      findsOneWidget,
    );
    await tester.tap(find.byKey(const ValueKey('gate0-block-reported-user')));
    await tester.pumpAndSettle();

    expect(find.text('Reported contacts'), findsNothing);
    expect(find.text('Report history retained'), findsOneWidget);
    expect(find.text('Block locks new report actions'), findsOneWidget);
    expect(find.text('Blocked users'), findsOneWidget);
    expect(find.text('Alex blocked from Contact Card'), findsOneWidget);
    expect(find.text('1 active block'), findsOneWidget);
  });

  testWidgets('Gate 0 List unblocking reported user restores report review',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-report-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-report-action')));
    await tester.pumpAndSettle();

    await scrollToLedgerAction(tester, 'gate0-block-reported-user');
    await tester.tap(find.byKey(const ValueKey('gate0-block-reported-user')));
    await tester.pumpAndSettle();

    await scrollToLedgerAction(tester, 'gate0-unblock-user');
    await tester.tap(find.byKey(const ValueKey('gate0-unblock-user')));
    await tester.pumpAndSettle();

    expect(find.text('Blocked users'), findsNothing);
    expect(find.text('Block removed'), findsOneWidget);
    expect(find.text('Report review still active'), findsOneWidget);
    expect(find.text('Reported contacts'), findsOneWidget);
    expect(find.text('1 ready for review'), findsOneWidget);
    expect(find.text('Review Reported Card'), findsOneWidget);
    expect(
        find.text('Contact Card locked until you share again'), findsNothing);

    await scrollToLedgerAction(tester, 'gate0-ledger-review-contact-card');
    await tester
        .tap(find.byKey(const ValueKey('gate0-ledger-review-contact-card')));
    await tester.pumpAndSettle();

    expect(find.text('LINE Contact Card'), findsOneWidget);
    expect(find.text('Report under review'), findsOneWidget);
    expect(
        find.text('Chat stays open while safety reviews it.'), findsOneWidget);
  });

  testWidgets('Gate 0 List closing restored report clears unblock notice',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-report-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-report-action')));
    await tester.pumpAndSettle();

    await scrollToLedgerAction(tester, 'gate0-block-reported-user');
    await tester.tap(find.byKey(const ValueKey('gate0-block-reported-user')));
    await tester.pumpAndSettle();

    await scrollToLedgerAction(tester, 'gate0-unblock-user');
    await tester.tap(find.byKey(const ValueKey('gate0-unblock-user')));
    await tester.pumpAndSettle();

    expect(find.text('Block removed'), findsOneWidget);
    expect(find.text('Report review still active'), findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-close-report-review');
    await tester.tap(find.byKey(const ValueKey('gate0-close-report-review')));
    await tester.pumpAndSettle();

    expect(find.text('Reported contacts'), findsNothing);
    expect(find.text('Report review closed'), findsOneWidget);
    expect(find.text('Closed report retained'), findsOneWidget);
    expect(find.text('Block removed'), findsNothing);
    expect(find.text('Report review still active'), findsNothing);
    expect(find.text('Block history retained'), findsOneWidget);
    expect(find.text('No reports pending'), findsOneWidget);
    expect(find.text('No active blocks'), findsOneWidget);
  });

  testWidgets('Gate 0 Safety Ledger keeps report count after block event',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-report')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-report')));
    await tester.pumpAndSettle();

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-block')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-block')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('1 ready for review'), findsOneWidget);
    expect(find.text('1 active block'), findsOneWidget);
    expect(find.text('Report history retained'), findsOneWidget);
    expect(find.text('Block locks new report actions'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-older-contact-safety-event-row')),
        findsOneWidget);
    expect(find.text('Contact Card report'), findsOneWidget);
    expect(find.text('LINE contact reported'), findsOneWidget);
    expect(find.text('Contact Card block'), findsOneWidget);
  });

  testWidgets('Gate 0 Safety Ledger summarizes contact event count',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-report')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-report')));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-block')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-block')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('2 safety contact events'), findsOneWidget);
    expect(find.text('2 recent contact events'), findsNothing);
    expect(find.text('Contact event history'), findsOneWidget);
    expect(find.text('Most recent first'), findsOneWidget);
    expect(find.text('Latest safety events'), findsNothing);
    expect(
      tester.getTopLeft(find.text('Contact Card block')).dy,
      lessThan(tester.getTopLeft(find.text('Contact Card report')).dy),
    );
    expect(find.text('2 guarded states'), findsNothing);
  });

  testWidgets('Gate 0 List tab shows current Contact Card state',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-block')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-block')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(
        find.byKey(const ValueKey('gate0-list-screen-title')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-list-screen-subtitle')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-cards-summary-row')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-current-contact-card-row')),
        findsOneWidget);
    final currentContactRow = tester.widget<SafetyLedgerRow>(
        find.byKey(const ValueKey('gate0-current-contact-card-row')));
    expect(currentContactRow.icon, Icons.block_outlined);
    expect(find.text('Current Contact Card'), findsOneWidget);
    expect(find.text('Block stays active'), findsOneWidget);
    expect(find.text('Blocked now'), findsNothing);
  });

  testWidgets('Gate 0 List tab shows current provider unavailable state',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(
        find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-current-contact-card-row')),
        findsOneWidget);
    expect(find.text('Current Contact Card'), findsOneWidget);
    expect(find.text('Provider unavailable now'), findsOneWidget);
    expect(find.text('Provider delayed now'), findsNothing);
  });

  testWidgets('Gate 0 List tab shows shared Contact Card state',
      (tester) async {
    await openLineContactCard(tester);

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-current-contact-card-row')),
        findsOneWidget);
    expect(find.text('Current Contact Card'), findsOneWidget);
    expect(find.text('1 shared Contact Card'), findsOneWidget);
    expect(find.text('No contact events yet'), findsNothing);
    expect(find.text('Shared by choice'), findsOneWidget);
    expect(find.text('Available now'), findsNothing);
    expect(find.text('Review Shared Card'), findsOneWidget);
    expect(find.text('Review Contact Card'), findsNothing);
    expect(find.text('Report Shared Card'), findsOneWidget);
    expect(find.text('Report'), findsNothing);
    expect(find.text('Block Shared Card'), findsOneWidget);
    expect(find.text('Block'), findsNothing);
  });

  testWidgets('Gate 0 List Contact Card summary opens shared card review',
      (tester) async {
    await openLineContactCard(tester);

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    await scrollToLedgerAction(
        tester, 'gate0-review-current-contact-card-from-summary');
    expect(
      find.byKey(
        const ValueKey('gate0-review-current-contact-card-from-summary-label'),
      ),
      findsOneWidget,
    );
    await tester.tap(find.byKey(
        const ValueKey('gate0-review-current-contact-card-from-summary')));
    await tester.pumpAndSettle();

    expect(find.text('Chat'), findsWidgets);
    expect(find.text('LINE Contact Card'), findsOneWidget);
    expect(find.text('Contact Card can be revoked'), findsOneWidget);
    expect(find.text('Copy disabled'), findsOneWidget);
  });

  testWidgets('Gate 0 List Contact cards summary opens shared card review',
      (tester) async {
    await openLineContactCard(tester);

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Contact cards'), findsOneWidget);
    expect(find.text('1 shared Contact Card'), findsOneWidget);

    await scrollToLedgerAction(
        tester, 'gate0-review-contact-cards-from-summary');
    expect(
        find.byKey(
            const ValueKey('gate0-review-contact-cards-from-summary-label')),
        findsOneWidget);
    await tester.tap(
      find.byKey(const ValueKey('gate0-review-contact-cards-from-summary')),
    );
    await tester.pumpAndSettle();

    expect(find.text('Chat'), findsWidgets);
    expect(find.text('LINE Contact Card'), findsOneWidget);
    expect(find.text('Contact Card can be revoked'), findsOneWidget);
    expect(find.text('Copy disabled'), findsOneWidget);
  });

  testWidgets('Gate 0 List Contact cards summary reports shared card',
      (tester) async {
    await openLineContactCard(tester);

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Contact cards'), findsOneWidget);
    expect(find.text('1 shared Contact Card'), findsOneWidget);

    await scrollToLedgerAction(
        tester, 'gate0-report-contact-cards-from-summary');
    expect(
        find.byKey(
            const ValueKey('gate0-report-contact-cards-from-summary-label')),
        findsOneWidget);
    await tester.tap(
      find.byKey(const ValueKey('gate0-report-contact-cards-from-summary')),
    );
    await tester.pumpAndSettle();

    expect(find.text('1 ready for review'), findsOneWidget);
    expect(find.text('Contact Card report'), findsOneWidget);
    expect(find.text('LINE contact reported'), findsOneWidget);
    expect(find.text('Reported contacts'), findsOneWidget);
    expect(find.text('Report logged'), findsOneWidget);
  });

  testWidgets('Gate 0 List Contact cards summary blocks shared card',
      (tester) async {
    await openLineContactCard(tester);

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Contact cards'), findsOneWidget);
    expect(find.text('1 shared Contact Card'), findsOneWidget);

    await scrollToLedgerAction(
        tester, 'gate0-block-contact-cards-from-summary');
    expect(
        find.byKey(
            const ValueKey('gate0-block-contact-cards-from-summary-label')),
        findsOneWidget);
    await tester.tap(
      find.byKey(const ValueKey('gate0-block-contact-cards-from-summary')),
    );
    await tester.pumpAndSettle();

    expect(find.text('1 active block'), findsOneWidget);
    expect(find.text('Contact Card block'), findsOneWidget);
    expect(find.text('LINE contact blocked'), findsOneWidget);
    expect(find.text('Blocked users'), findsOneWidget);
    expect(find.text('Block active'), findsOneWidget);
    expect(find.text('Report locked'), findsOneWidget);
  });

  testWidgets('Gate 0 List tab records Contact Card revoke event',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-revoke')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-revoke')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-contact-safety-event-row')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-current-contact-card-row')),
        findsOneWidget);
    expect(find.text('Current Contact Card'), findsOneWidget);
    expect(find.text('Revoked by you'), findsOneWidget);
    expect(find.text('Revoked now'), findsNothing);
    expect(find.text('Contact Card revoked'), findsOneWidget);
    expect(find.text('LINE contact revoked'), findsOneWidget);
    expect(find.text('Report Revoked Card'), findsOneWidget);
    expect(find.text('Report'), findsNothing);
    expect(find.text('Block Revoked Card'), findsOneWidget);
    expect(find.text('Block'), findsNothing);
  });

  testWidgets('Gate 0 List tab opens revoked Contact Card for review',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-revoke')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-revoke')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Review Revoked Card'), findsOneWidget);
    await scrollToLedgerAction(tester, 'gate0-ledger-review-contact-card');
    await tester
        .tap(find.byKey(const ValueKey('gate0-ledger-review-contact-card')));
    await tester.pumpAndSettle();

    expect(find.text('LINE Contact Card'), findsOneWidget);
    expect(find.text('Contact Card revoked by you'), findsOneWidget);
    expect(find.text('Review sharing again to create a new card.'),
        findsOneWidget);
  });

  testWidgets('Gate 0 List tab can restart sharing after revoke',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-revoke')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-revoke')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    await scrollToLedgerAction(tester, 'gate0-ledger-review-share-again');
    expect(find.byKey(const ValueKey('gate0-ledger-review-share-again-label')),
        findsOneWidget);
    await tester
        .tap(find.byKey(const ValueKey('gate0-ledger-review-share-again')));
    await tester.pumpAndSettle();

    expect(find.text('Chat'), findsWidgets);
    expect(find.text('Share LINE?'), findsOneWidget);
    expect(find.text('Contact Card locked'), findsOneWidget);
    expect(find.text('Share LINE'), findsOneWidget);
  });

  testWidgets('Gate 0 List Contact Card summary restarts sharing after revoke',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-revoke')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-revoke')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Revoked by you'), findsOneWidget);
    await scrollToLedgerAction(
        tester, 'gate0-review-sharing-again-from-summary');
    expect(
      find.byKey(
        const ValueKey('gate0-review-sharing-again-from-summary-label'),
      ),
      findsOneWidget,
    );
    await tester.tap(
        find.byKey(const ValueKey('gate0-review-sharing-again-from-summary')));
    await tester.pumpAndSettle();

    expect(find.text('Chat'), findsWidgets);
    expect(find.text('Share LINE?'), findsOneWidget);
    expect(find.text('Contact Card locked'), findsOneWidget);
    expect(find.text('Share LINE'), findsOneWidget);
  });

  testWidgets('Gate 0 List Contact cards summary restarts sharing after revoke',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-revoke')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-contact-revoke')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Contact cards'), findsOneWidget);
    expect(find.text('1 safety contact event'), findsOneWidget);

    await scrollToLedgerAction(
        tester, 'gate0-review-contact-cards-again-from-summary');
    expect(
      find.byKey(
        const ValueKey('gate0-review-contact-cards-again-from-summary-label'),
      ),
      findsOneWidget,
    );
    await tester.tap(find.byKey(
        const ValueKey('gate0-review-contact-cards-again-from-summary')));
    await tester.pumpAndSettle();

    expect(find.text('Chat'), findsWidgets);
    expect(find.text('Share LINE?'), findsOneWidget);
    expect(find.text('Contact Card locked'), findsOneWidget);
    expect(find.text('Share LINE'), findsOneWidget);
  });

  testWidgets('Gate 0 List tab records provider unavailable event',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(
        find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-contact-safety-event-row')),
        findsOneWidget);
    expect(find.text('Contact Card delayed'), findsOneWidget);
    expect(find.text('LINE provider unavailable'), findsOneWidget);
    expect(find.text('Report Delayed Card'), findsOneWidget);
    expect(find.text('Report'), findsNothing);
    expect(find.text('Block Delayed Card'), findsOneWidget);
    expect(find.text('Block'), findsNothing);
  });

  testWidgets('Gate 0 List tab opens delayed Contact Card for review',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(
        find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Review Delayed Card'), findsOneWidget);
    await scrollToLedgerAction(tester, 'gate0-ledger-review-contact-card');
    await tester
        .tap(find.byKey(const ValueKey('gate0-ledger-review-contact-card')));
    await tester.pumpAndSettle();

    expect(find.text('LINE Contact Card'), findsOneWidget);
    expect(find.text('Contact access delayed'), findsOneWidget);
    expect(find.text('Provider temporarily unavailable'), findsOneWidget);
    expect(
      find.byKey(
        const ValueKey('gate0-contact-state-alert-provider-unavailable-detail'),
      ),
      findsOneWidget,
    );
    expect(find.text('Retry keeps raw LINE hidden.'), findsOneWidget);
  });

  testWidgets('Gate 0 List tab retries delayed Contact Card', (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(
        find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Review Delayed Card'), findsOneWidget);
    await scrollToLedgerAction(tester, 'gate0-ledger-retry-contact-card');
    expect(find.byKey(const ValueKey('gate0-ledger-retry-contact-card-label')),
        findsOneWidget);
    await tester
        .tap(find.byKey(const ValueKey('gate0-ledger-retry-contact-card')));
    await tester.pumpAndSettle();

    expect(find.text('Shared by choice'), findsOneWidget);
    expect(find.text('Review Shared Card'), findsOneWidget);
    expect(find.text('Contact Card delayed'), findsOneWidget);
    expect(find.text('LINE provider unavailable'), findsOneWidget);
    expect(find.text('Retry Contact Card'), findsNothing);
  });

  testWidgets('Gate 0 List Contact Card summary retries delayed card',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(
        find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Provider unavailable now'), findsOneWidget);
    await scrollToLedgerAction(
        tester, 'gate0-retry-current-contact-card-from-summary');
    expect(
      find.byKey(
        const ValueKey('gate0-retry-current-contact-card-from-summary-label'),
      ),
      findsOneWidget,
    );
    await tester.tap(find.byKey(
        const ValueKey('gate0-retry-current-contact-card-from-summary')));
    await tester.pumpAndSettle();

    expect(find.text('Shared by choice'), findsOneWidget);
    expect(find.text('Provider unavailable now'), findsNothing);
    expect(find.text('Review Shared Card'), findsOneWidget);
    expect(find.text('Contact Card delayed'), findsOneWidget);
  });

  testWidgets('Gate 0 List Contact cards summary retries delayed card',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(
        find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Contact cards'), findsOneWidget);
    expect(find.text('1 safety contact event'), findsOneWidget);

    await scrollToLedgerAction(
        tester, 'gate0-retry-contact-cards-from-summary');
    expect(
      find.byKey(
        const ValueKey('gate0-retry-contact-cards-from-summary-label'),
      ),
      findsOneWidget,
    );
    await tester.tap(
      find.byKey(const ValueKey('gate0-retry-contact-cards-from-summary')),
    );
    await tester.pumpAndSettle();

    expect(find.text('Shared by choice'), findsOneWidget);
    expect(find.text('Provider unavailable now'), findsNothing);
    expect(find.text('Review Shared Card'), findsOneWidget);
    expect(find.text('Contact Card delayed'), findsOneWidget);
  });

  testWidgets('Gate 0 provider unavailable state can retry to available',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(
        find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')));
    await tester.pumpAndSettle();

    expect(find.text('Contact access delayed'), findsOneWidget);
    expect(find.text('Provider temporarily unavailable'), findsOneWidget);
    expect(find.text('Retry keeps raw LINE hidden.'), findsOneWidget);

    expect(find.byKey(const ValueKey('gate0-contact-retry-label')),
        findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('gate0-contact-retry')));
    await tester.pumpAndSettle();

    expect(find.textContaining('Contact state: Available'), findsOneWidget);
    expect(find.textContaining('LINE contact available'), findsOneWidget);
    expect(find.text('Contact access delayed'), findsNothing);
    expect(find.text('Retry not needed'), findsOneWidget);
    expect(find.text('Retry later'), findsNothing);
  });

  testWidgets('Gate 0 provider unavailable event stays in ledger after retry',
      (tester) async {
    await openLineContactCard(tester);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(
        find.byKey(const ValueKey('gate0-contact-state-providerUnavailable')));
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const ValueKey('gate0-contact-retry')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-contact-safety-event-row')),
        findsOneWidget);
    expect(find.text('Contact Card delayed'), findsOneWidget);
    expect(find.text('LINE provider unavailable'), findsOneWidget);
  });

  testWidgets('Gate 0 LINE Contact Card shows a redacted safety preview',
      (tester) async {
    await openLineContactCard(tester);

    expect(find.byKey(const ValueKey('gate0-line-contact-preview')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-contact-preview-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-contact-preview-subtitle')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-contact-preview-copy-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-contact-preview-copy-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-contact-preview-choice-chip')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-line-contact-preview-choice-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-contact-preview-state-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-contact-preview-state-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-contact-preview-safety-chip')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-line-contact-preview-safety-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-contact-preview-description')),
        findsOneWidget);
    expect(find.text('Redacted LINE card'), findsOneWidget);
    expect(find.text('Preview visible'), findsOneWidget);
    expect(find.text('Copy disabled'), findsOneWidget);
    expect(find.text('Shared by choice'), findsOneWidget);
    expect(find.text('Report or block anytime'), findsOneWidget);
    expect(find.textContaining('LINE contact available'), findsOneWidget);
  });

  testWidgets('Gate 0 Chat replaces share confirmation after LINE is shared',
      (tester) async {
    await openLineContactCard(tester);

    expect(
        find.byKey(const ValueKey('gate0-line-share-receipt')), findsOneWidget);
    expect(find.text('LINE share confirmed'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-share-receipt-title')),
        findsOneWidget);
    expect(find.text('Raw LINE still hidden'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-share-receipt-hidden-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-share-receipt-hidden-label')),
        findsOneWidget);
    expect(find.text('Contact Card can be revoked'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-share-receipt-revoke-copy')),
        findsOneWidget);
    expect(find.text('Share LINE?'), findsNothing);
  });

  testWidgets(
      'Gate 0 mobile shell hides internal screen names from user-facing copy',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    expect(find.text('Discover'), findsWidgets);
    expect(find.text('View Profile'), findsOneWidget);
    expect(find.text('DiscoverSwipe'), findsNothing);
    expect(find.text('Open ProfileDetail'), findsNothing);

    await tester.tap(find.byKey(const ValueKey('gate0-open-profile-detail')));
    await tester.pumpAndSettle();
    expect(find.text('Profile'), findsOneWidget);
    expect(find.text('ProfileDetail'), findsNothing);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-profile-start-chat')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-profile-start-chat')));
    await tester.pumpAndSettle();
    expect(find.text('Share LINE?'), findsOneWidget);
    expect(find.text('FirstShareConfirmation'), findsNothing);

    await tester.tap(find.text('Share LINE'));
    await tester.pumpAndSettle();
    expect(find.text('LINE sharing'), findsOneWidget);
    expect(find.text('ChatContactCard'), findsNothing);
  });

  testWidgets('Gate 0 web preview keeps the app at phone width on wide screens',
      (tester) async {
    tester.view.physicalSize = const Size(1200, 900);
    tester.view.devicePixelRatio = 1;
    addTearDown(() {
      tester.view.resetPhysicalSize();
      tester.view.resetDevicePixelRatio();
    });

    await tester.pumpWidget(const ThaiMeetApp());

    final frameFinder = find.byKey(const ValueKey('gate0-device-frame'));
    expect(frameFinder, findsOneWidget);
    expect(tester.getSize(frameFinder).width, lessThanOrEqualTo(430));
    expect(tester.getTopLeft(frameFinder).dx, greaterThan(300));
  });

  testWidgets('Gate 0 discover card shows a visual public profile preview',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    expect(find.byKey(const ValueKey('gate0-discover-screen-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-discover-screen-subtitle')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-visual')), findsOneWidget);
    expect(find.text('A'), findsOneWidget);
    expect(find.text('Public profile'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-visual-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-visual-location')),
        findsOneWidget);
    expect(
      find.byKey(const ValueKey('gate0-profile-visual-line-off-chip')),
      findsOneWidget,
    );
    expect(
      find.byKey(const ValueKey('gate0-profile-visual-line-off-label')),
      findsOneWidget,
    );
    expect(find.text('LINE off'), findsOneWidget);
    expect(find.textContaining('2 km nearby'), findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-profile-card-name')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-card-location')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-card-privacy-copy')),
        findsOneWidget);
    expect(
      find.byKey(const ValueKey('gate0-open-profile-detail-label')),
      findsOneWidget,
    );
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-start-chat')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    expect(
        find.byKey(const ValueKey('gate0-start-chat-label')), findsOneWidget);
  });

  testWidgets('Gate 0 Swipe tab shows a guarded swipe queue', (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('Swipe').last);
    await tester.pumpAndSettle();

    expect(
        find.byKey(const ValueKey('gate0-swipe-screen-title')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-swipe-screen-subtitle')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-swipe-queue-card')), findsOneWidget);
    expect(find.text('Swipe Queue'), findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-swipe-queue-title')), findsOneWidget);
    expect(find.text('1 of 8 nearby'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-swipe-queue-count-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-swipe-queue-count-label')),
        findsOneWidget);
    expect(find.text('LINE hidden until chat'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-swipe-line-hidden-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-swipe-line-hidden-label')),
        findsOneWidget);
    expect(find.text('Public ID first'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-swipe-public-id-first-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-swipe-public-id-first-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-swipe-skip-action-label')),
        findsOneWidget);
    expect(find.text('Skip'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-swipe-open-profile-label')),
        findsOneWidget);
    expect(find.text('View Profile'), findsOneWidget);
  });

  testWidgets('Gate 0 Swipe skip shows a private empty queue', (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('Swipe').last);
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-swipe-skip-action')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-swipe-skip-action')));
    await tester.pumpAndSettle();

    expect(
        find.byKey(const ValueKey('gate0-swipe-empty-card')), findsOneWidget);
    expect(find.text('All caught up'), findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-swipe-empty-title')), findsOneWidget);
    expect(
      find.byKey(const ValueKey('gate0-swipe-empty-privacy-copy')),
      findsOneWidget,
    );
    expect(find.text('LINE stayed hidden'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-swipe-empty-line-hidden-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-swipe-empty-line-hidden-label')),
        findsOneWidget);
    expect(find.text('Public ID only'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-swipe-empty-public-id-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-swipe-empty-public-id-label')),
        findsOneWidget);
    expect(
      find.byKey(const ValueKey('gate0-swipe-return-discover-label')),
      findsOneWidget,
    );
    expect(find.byKey(const ValueKey('gate0-swipe-queue-card')), findsNothing);
  });

  testWidgets('Gate 0 Profile detail shows trust checks before chat',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.byKey(const ValueKey('gate0-open-profile-detail')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-profile-screen-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-screen-subtitle')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-profile-trust-card')), findsOneWidget);
    expect(find.text('Profile Trust Check'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-trust-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-trust-avatar-initial')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-trust-public-id')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-profile-trust-name')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-trust-location')),
        findsOneWidget);
    expect(find.text('Public ID verified'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-public-id-verified-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-public-id-verified-label')),
        findsOneWidget);
    expect(find.text('LINE hidden before chat'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-line-hidden-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-line-hidden-label')),
        findsOneWidget);
    expect(find.text('Report or block before starting chat'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-profile-safety-copy')),
        findsOneWidget);
    expect(find.text('Start Chat'), findsOneWidget);
    expect(
      find.byKey(const ValueKey('gate0-profile-start-chat-label')),
      findsOneWidget,
    );
    expect(
        find.byKey(const ValueKey('gate0-profile-start-chat')), findsOneWidget);
    expect(find.text('Report'), findsOneWidget);
    expect(find.text('Block'), findsOneWidget);
  });

  testWidgets('Gate 0 Profile report action records a safety event',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.byKey(const ValueKey('gate0-open-profile-detail')));
    await tester.pumpAndSettle();
    expect(
      find.byKey(const ValueKey('gate0-profile-report-action-label')),
      findsOneWidget,
    );
    await tester.tap(find.byKey(const ValueKey('gate0-profile-report-action')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('1 ready for review'), findsOneWidget);
    expect(find.text('Contact Card report'), findsOneWidget);
    expect(find.text('LINE contact reported'), findsOneWidget);
    expect(find.text('Report logged'), findsOneWidget);
  });

  testWidgets('Gate 0 Profile block action protects Chat contact card',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.byKey(const ValueKey('gate0-open-profile-detail')));
    await tester.pumpAndSettle();
    expect(
      find.byKey(const ValueKey('gate0-profile-block-action-label')),
      findsOneWidget,
    );
    await tester.tap(find.byKey(const ValueKey('gate0-profile-block-action')));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-profile-start-chat')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-profile-start-chat')));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Share LINE'));
    await tester.pumpAndSettle();

    expect(find.text('Contact access unavailable'), findsOneWidget);
    expect(find.textContaining('Contact state: Blocked'), findsOneWidget);
    expect(find.textContaining('LINE contact blocked'), findsOneWidget);
    expect(find.textContaining('LINE contact available'), findsNothing);
  });

  testWidgets('Gate 0 Chat shows a locked contact card before sharing',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('Chat').last);
    await tester.pumpAndSettle();

    expect(
        find.byKey(const ValueKey('gate0-chat-screen-title')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-chat-screen-subtitle')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-chat-message-msg_gate0_001')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-chat-message-text-msg_gate0_001')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-chat-message-msg_gate0_002')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-chat-message-text-msg_gate0_002')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-chat-lock-card')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-chat-lock-card-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-chat-lock-card-hidden-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-chat-lock-card-hidden-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-chat-lock-card-choice-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-chat-lock-card-choice-label')),
        findsOneWidget);
    expect(find.text('Contact Card locked'), findsOneWidget);
    expect(find.text('Raw LINE not in messages'), findsOneWidget);
    expect(find.text('Share only by choice'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-share-line-confirmation')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-share-line-confirmation-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-share-line-confirmation-body')),
        findsOneWidget);
    expect(find.text('Share LINE?'), findsOneWidget);
    expect(
      find.byKey(const ValueKey('gate0-share-line-cancel-label')),
      findsOneWidget,
    );
    expect(
      find.byKey(const ValueKey('gate0-share-line-label')),
      findsOneWidget,
    );
    expect(find.text('Share LINE'), findsOneWidget);
  });

  testWidgets('Gate 0 Chat cancel keeps LINE share locked', (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('Chat').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-share-line-cancel')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-line-share-cancelled')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-share-cancelled-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-share-cancelled-detail')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-share-cancelled-hidden-chip')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-line-share-cancelled-hidden-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-share-cancelled-chat-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-share-cancelled-chat-label')),
        findsOneWidget);
    expect(find.text('LINE share cancelled'), findsOneWidget);
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-chat-lock-card')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('gate0-chat-lock-card')), findsOneWidget);
    expect(find.text('LINE Contact Card'), findsNothing);
  });

  testWidgets('Gate 0 Chat can review LINE share after cancel', (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('Chat').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-share-line-cancel')));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-review-line-share')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    expect(
      find.byKey(const ValueKey('gate0-review-line-share-label')),
      findsOneWidget,
    );
    await tester.tap(find.byKey(const ValueKey('gate0-review-line-share')));
    await tester.pumpAndSettle();

    expect(
        find.byKey(const ValueKey('gate0-line-share-cancelled')), findsNothing);
    expect(find.text('Share LINE?'), findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-view-contact-card')), findsOneWidget);
    expect(
      find.byKey(const ValueKey('gate0-view-contact-card-label')),
      findsOneWidget,
    );
    expect(find.byKey(const ValueKey('gate0-share-line')), findsOneWidget);
  });

  testWidgets('Gate 0 Chat requires LINE setup before first share',
      (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Gate0DeviceFrame(
          child: Gate0Shell(lineContactRegistered: false),
        ),
      ),
    );

    await tester.tap(find.text('Chat').last);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-line-setup-required')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-setup-required-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-setup-required-detail')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-setup-required-hidden-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-setup-required-hidden-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-setup-required-chat-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-setup-required-chat-label')),
        findsOneWidget);
    expect(find.text('Set up LINE to share'), findsOneWidget);
    expect(find.text('Share LINE'), findsNothing);

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-line-setup-from-chat')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    expect(
      find.byKey(const ValueKey('gate0-line-setup-from-chat-label')),
      findsOneWidget,
    );
    await tester.tap(find.byKey(const ValueKey('gate0-line-setup-from-chat')));
    await tester.pumpAndSettle();

    expect(find.text('My'), findsWidgets);
    expect(find.byKey(const ValueKey('gate0-public-id-card')), findsOneWidget);
    expect(find.text('LINE not set up'), findsOneWidget);
  });

  testWidgets('Gate 0 returns to Chat after LINE setup from share flow',
      (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Gate0DeviceFrame(
          child: Gate0Shell(lineContactRegistered: false),
        ),
      ),
    );

    await tester.tap(find.text('Chat').last);
    await tester.pumpAndSettle();

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-line-setup-from-chat')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-line-setup-from-chat')));
    await tester.pumpAndSettle();

    expect(find.text('LINE not set up'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('gate0-line-setup-in-my')));
    await tester.pumpAndSettle();

    expect(find.text('Chat'), findsWidgets);
    expect(find.text('Share LINE?'), findsOneWidget);
    expect(find.text('Share LINE'), findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-line-setup-required')), findsNothing);
  });

  testWidgets('Gate 0 My tab shows Public ID and LINE setup controls',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-my-screen-title')), findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-my-screen-subtitle')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-card')), findsOneWidget);
    expect(find.text('Public Meet ID'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-title')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-current-value')),
        findsOneWidget);
    expect(find.text('Active now'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-active-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-active-label')),
        findsOneWidget);
    expect(find.text('LINE ready'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-line-status-chip')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-line-status-label')),
        findsOneWidget);
    expect(find.text('History starts after regeneration'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-history-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-privacy-copy')),
        findsOneWidget);
    expect(find.text('Regenerate Public ID'), findsOneWidget);
    expect(find.text('Update LINE'), findsOneWidget);
    expect(
      find.byKey(const ValueKey('gate0-line-setup-in-my-label')),
      findsOneWidget,
    );
    expect(find.text('Set up LINE'), findsNothing);
  });

  testWidgets('Gate 0 My tab confirms LINE update stays private',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-line-setup-in-my')));
    await tester.pumpAndSettle();

    expect(
        find.byKey(const ValueKey('gate0-line-update-notice')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-update-notice-title')),
        findsOneWidget);
    expect(find.text('LINE updated just now'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-line-update-notice-privacy')),
        findsOneWidget);
    expect(find.text('Raw LINE still separate'), findsOneWidget);
    expect(find.text('Update LINE'), findsOneWidget);
  });

  testWidgets('Gate 0 My tab shares Public ID without exposing LINE',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    expect(
      find.byKey(const ValueKey('gate0-share-public-id-label')),
      findsOneWidget,
    );
    await tester.tap(find.byKey(const ValueKey('gate0-share-public-id')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-public-id-share-notice')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-share-notice-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-share-notice-detail')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-share-notice-privacy')),
        findsOneWidget);
    expect(find.text('Public ID shared just now'), findsOneWidget);
    expect(find.text('TM-BKK-001 shared'), findsOneWidget);
    expect(find.text('Raw LINE still separate'), findsOneWidget);
  });

  testWidgets('Gate 0 My shared Public ID notice opens List history',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-share-public-id')));
    await tester.pumpAndSettle();

    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-view-shared-public-id-history')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    expect(
      find.byKey(
        const ValueKey('gate0-view-shared-public-id-history-label'),
      ),
      findsOneWidget,
    );
    await tester
        .tap(find.byKey(const ValueKey('gate0-view-shared-public-id-history')));
    await tester.pumpAndSettle();

    expect(find.text('List'), findsWidgets);
    expect(find.byKey(const ValueKey('gate0-shared-public-id-row')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-summary-row')),
        findsOneWidget);
    expect(find.text('1 shared current ID'), findsOneWidget);
    expect(find.text('Current shared Public ID'), findsOneWidget);
    expect(find.text('TM-BKK-001 shared'), findsOneWidget);
    expect(find.text('Raw LINE still separate'), findsOneWidget);
  });

  testWidgets('Gate 0 List tab records shared Public ID without exposing LINE',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-share-public-id')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-shared-public-id-row')),
        findsOneWidget);
    expect(
        find.byKey(
            const ValueKey('gate0-current-shared-public-id-summary-row')),
        findsOneWidget);
    expect(
        find.byKey(
            const ValueKey('gate0-current-shared-public-id-summary-title')),
        findsOneWidget);
    expect(
        find.byKey(
            const ValueKey('gate0-current-shared-public-id-summary-detail')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-current-shared-public-id-value-row')),
        findsOneWidget);
    expect(
        find.byKey(
            const ValueKey('gate0-current-shared-public-id-value-title')),
        findsOneWidget);
    expect(
        find.byKey(
            const ValueKey('gate0-current-shared-public-id-value-detail')),
        findsOneWidget);
    final publicIdSummaryRow = tester.widget<SafetyLedgerRow>(
      find.byKey(const ValueKey('gate0-public-id-summary-row')),
    );
    expect(publicIdSummaryRow.icon, Icons.ios_share_outlined);
    expect(publicIdSummaryRow.detail, '1 shared current ID');
    expect(find.text('Current shared Public ID'), findsOneWidget);
    expect(find.text('TM-BKK-001 shared'), findsOneWidget);
    expect(find.text('Raw LINE still separate'), findsOneWidget);
  });

  testWidgets('Gate 0 List Public IDs summary opens My ID manager',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-share-public-id')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    expect(
      find.byKey(
        const ValueKey('gate0-manage-public-ids-from-summary-label'),
      ),
      findsOneWidget,
    );
    await tester.tap(
      find.byKey(const ValueKey('gate0-manage-public-ids-from-summary')),
    );
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-public-id-card')), findsOneWidget);
    expect(find.text('Public Meet ID'), findsOneWidget);
    expect(find.text('TM-BKK-001 shared'), findsOneWidget);
  });

  testWidgets('Gate 0 List shared Public ID row opens My ID manager',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-share-public-id')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-manage-shared-public-id')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    expect(
      find.byKey(const ValueKey('gate0-manage-shared-public-id-label')),
      findsOneWidget,
    );
    await tester
        .tap(find.byKey(const ValueKey('gate0-manage-shared-public-id')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-public-id-card')), findsOneWidget);
    expect(find.text('Public Meet ID'), findsOneWidget);
    expect(find.text('TM-BKK-001 shared'), findsOneWidget);
    expect(find.text('Share Public ID'), findsOneWidget);
  });

  testWidgets('Gate 0 List tab keeps shared Public ID archive context',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-share-public-id')));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-regenerate-public-id')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-regenerate-public-id')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(
        find.byKey(const ValueKey('gate0-shared-public-id-row')), findsNothing);
    expect(find.text('Latest shared archived Public ID'), findsOneWidget);
    expect(find.text('1 shared archived ID, most recent first'), findsWidgets);
    expect(find.text('TM-BKK-001 shared before archive'), findsOneWidget);
    expect(find.text('TM-BKK-002 shared'), findsNothing);
  });

  testWidgets('Gate 0 List summarizes current and archived shared Public IDs',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-share-public-id')));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-regenerate-public-id')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-regenerate-public-id')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-share-public-id')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    final publicIdSummaryRow = tester.widget<SafetyLedgerRow>(
      find.byKey(const ValueKey('gate0-public-id-summary-row')),
    );
    expect(publicIdSummaryRow.detail, '1 current and 1 archived shared ID');
    expect(find.byKey(const ValueKey('gate0-public-id-history-summary-row')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-history-summary-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-history-summary-detail')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-latest-archived-public-id-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-latest-archived-public-id-detail')),
        findsOneWidget);
    expect(find.text('Current shared Public ID'), findsOneWidget);
    expect(find.text('Latest shared archived Public ID'), findsOneWidget);
    expect(find.text('TM-BKK-002 shared'), findsOneWidget);
    expect(find.text('TM-BKK-001 shared before archive'), findsOneWidget);
  });

  testWidgets('Gate 0 List shared archive row opens My ID manager',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-share-public-id')));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-regenerate-public-id')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-regenerate-public-id')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    expect(
      find.byKey(const ValueKey('gate0-manage-archived-public-id-TM-BKK-001')),
      findsOneWidget,
    );
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-manage-archived-public-id-TM-BKK-001')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    expect(
      find.byKey(
        const ValueKey('gate0-latest-archived-public-id-manage-action-label'),
      ),
      findsOneWidget,
    );
    await tester.tap(
      find.byKey(const ValueKey('gate0-manage-archived-public-id-TM-BKK-001')),
    );
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-public-id-card')), findsOneWidget);
    expect(find.text('Public Meet ID'), findsOneWidget);
    expect(find.text('TM-BKK-002'), findsWidgets);
    expect(find.text('TM-BKK-001 shared before archive'), findsOneWidget);
  });

  testWidgets('Gate 0 List summarizes mixed shared and plain archived IDs',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-share-public-id')));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-regenerate-public-id')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-regenerate-public-id')));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-regenerate-public-id')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-regenerate-public-id')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('1 shared of 2 archived IDs, most recent first'),
        findsWidgets);
    expect(find.text('TM-BKK-001 shared before archive'), findsOneWidget);
    expect(find.text('TM-BKK-002 archived'), findsOneWidget);
    expect(find.text('1 shared archived ID, most recent first'), findsNothing);
  });

  testWidgets('Gate 0 My archive notice keeps shared Public ID context',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-share-public-id')));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-regenerate-public-id')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-regenerate-public-id')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-public-id-archive-notice')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-archive-notice-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-archive-notice-detail')),
        findsOneWidget);
    expect(find.text('TM-BKK-001 shared before archive'), findsOneWidget);
    expect(find.text('Previous shared ID archived'), findsOneWidget);
    expect(find.text('TM-BKK-002 shared'), findsNothing);
  });

  testWidgets('Gate 0 Public ID regeneration clears LINE update notice',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-line-setup-in-my')));
    await tester.pumpAndSettle();

    expect(
        find.byKey(const ValueKey('gate0-line-update-notice')), findsOneWidget);

    await tester.tap(find.text('Regenerate Public ID'));
    await tester.pumpAndSettle();

    expect(
        find.byKey(const ValueKey('gate0-line-update-notice')), findsNothing);
    expect(find.text('Previous ID archived'), findsOneWidget);
    expect(find.text('TM-BKK-001 archived'), findsOneWidget);
  });

  testWidgets('Gate 0 My tab regenerates Public Meet ID with archive notice',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();

    expect(find.text('TM-BKK-001'), findsWidgets);
    expect(find.text('TM-BKK-002'), findsNothing);
    expect(
      find.byKey(const ValueKey('gate0-regenerate-public-id-label')),
      findsOneWidget,
    );

    await tester.tap(find.text('Regenerate Public ID'));
    await tester.pumpAndSettle();

    expect(find.text('TM-BKK-002'), findsWidgets);
    expect(find.text('Previous ID archived'), findsOneWidget);
    expect(find.text('TM-BKK-001 archived'), findsOneWidget);
  });

  testWidgets('Gate 0 My archive notice opens Public ID history',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Regenerate Public ID'));
    await tester.pumpAndSettle();

    expect(
      find.byKey(const ValueKey('gate0-view-public-id-history-label')),
      findsOneWidget,
    );
    await tester
        .tap(find.byKey(const ValueKey('gate0-view-public-id-history')));
    await tester.pumpAndSettle();

    expect(find.text('Public ID history'), findsOneWidget);
    expect(find.text('Latest archived Public ID'), findsOneWidget);
    expect(
        find.byKey(
            const ValueKey('gate0-latest-archived-public-id-manage-action')),
        findsOneWidget);
    expect(find.text('TM-BKK-001 archived'), findsOneWidget);
  });

  testWidgets('Gate 0 Public ID regeneration creates a fresh next ID',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-regenerate-public-id')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-regenerate-public-id')));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-regenerate-public-id')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-regenerate-public-id')));
    await tester.pumpAndSettle();

    expect(find.text('TM-BKK-003'), findsWidgets);
    expect(find.text('TM-BKK-002 archived'), findsOneWidget);
    expect(find.text('TM-BKK-001 archived'), findsNothing);
  });

  testWidgets(
      'Gate 0 List tab records archived Public Meet ID after regeneration',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Regenerate Public ID'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-archived-public-id-row')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-latest-archived-public-id-row')),
        findsOneWidget);
    expect(find.text('Latest archived Public ID'), findsOneWidget);
    expect(find.text('TM-BKK-001 archived'), findsOneWidget);
  });

  testWidgets('Gate 0 List tab keeps Public ID archive history',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('My').last);
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-regenerate-public-id')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-regenerate-public-id')));
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('gate0-regenerate-public-id')),
      80,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('gate0-regenerate-public-id')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Public ID history'), findsOneWidget);
    final publicIdSummaryRow = tester.widget<SafetyLedgerRow>(
      find.byKey(const ValueKey('gate0-public-id-summary-row')),
    );
    expect(publicIdSummaryRow.icon, Icons.archive_outlined);
    expect(find.text('2 archived IDs, most recent first'), findsWidgets);
    expect(find.text('2 archived IDs'), findsNothing);
    expect(find.text('Latest archived Public ID'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-older-archived-public-id-row')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey(
            'gate0-older-archived-public-id-manage-action-label')),
        findsOneWidget);
    expect(find.text('TM-BKK-001 archived'), findsOneWidget);
    expect(find.text('TM-BKK-002 archived'), findsOneWidget);
    expect(
      tester.getTopLeft(find.text('TM-BKK-002 archived')).dy,
      lessThan(tester.getTopLeft(find.text('TM-BKK-001 archived')).dy),
    );
  });

  testWidgets('Gate 0 List tab starts safety ledger counts at zero',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-current-contact-card-row')),
        findsOneWidget);
    final currentContactRow = tester.widget<SafetyLedgerRow>(
        find.byKey(const ValueKey('gate0-current-contact-card-row')));
    expect(currentContactRow.icon, Icons.lock_outline);
    expect(find.text('Current Contact Card'), findsOneWidget);
    expect(find.text('Share not started'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-summary-row')),
        findsOneWidget);
    expect(find.text('Public IDs'), findsOneWidget);
    expect(find.text('No public ID events yet'), findsOneWidget);
    expect(find.text('Locked now'), findsNothing);
    expect(find.text('No reports pending'), findsOneWidget);
    expect(find.text('No active blocks'), findsOneWidget);
    expect(find.text('Share first to review'), findsOneWidget);
    expect(find.text('Review Contact Card'), findsNothing);

    final reviewAction = tester.widget<OutlinedButton>(
        find.byKey(const ValueKey('gate0-ledger-review-contact-card')));
    expect(reviewAction.onPressed, isNull);
  });

  testWidgets('Gate 0 List tab opens Chat to start Contact Card sharing',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    await scrollToLedgerAction(tester, 'gate0-ledger-open-share');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-open-share')));
    await tester.pumpAndSettle();

    expect(find.text('Chat'), findsWidgets);
    expect(find.text('Share LINE?'), findsOneWidget);
    expect(find.text('Contact Card locked'), findsOneWidget);
    expect(find.text('Share LINE'), findsOneWidget);
  });

  testWidgets('Gate 0 List Contact Card summary starts sharing from locked',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Share not started'), findsOneWidget);
    await scrollToLedgerAction(tester, 'gate0-start-contact-card-from-summary');
    expect(
      find.byKey(
        const ValueKey('gate0-start-contact-card-from-summary-label'),
      ),
      findsOneWidget,
    );
    await tester.tap(
        find.byKey(const ValueKey('gate0-start-contact-card-from-summary')));
    await tester.pumpAndSettle();

    expect(find.text('Chat'), findsWidgets);
    expect(find.text('Share LINE?'), findsOneWidget);
    expect(find.text('Contact Card locked'), findsOneWidget);
    expect(find.text('Share LINE'), findsOneWidget);
  });

  testWidgets('Gate 0 List Contact cards summary starts sharing from locked',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Contact cards'), findsOneWidget);
    expect(find.text('No contact events yet'), findsOneWidget);

    await scrollToLedgerAction(
        tester, 'gate0-start-contact-cards-from-summary');
    expect(
        find.byKey(
            const ValueKey('gate0-start-contact-cards-from-summary-label')),
        findsOneWidget);
    await tester.tap(
      find.byKey(const ValueKey('gate0-start-contact-cards-from-summary')),
    );
    await tester.pumpAndSettle();

    expect(find.text('Chat'), findsWidgets);
    expect(find.text('Share LINE?'), findsOneWidget);
    expect(find.text('Contact Card locked'), findsOneWidget);
    expect(find.text('Share LINE'), findsOneWidget);
  });

  testWidgets('Gate 0 List tab report action records a safety event',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    await scrollToLedgerAction(tester, 'gate0-ledger-report-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-report-action')));
    await tester.pumpAndSettle();

    expect(find.text('1 ready for review'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-safety-event-row')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-contact-event-history-summary-title')),
        findsOneWidget);
    expect(
        find.byKey(
            const ValueKey('gate0-contact-event-history-summary-detail')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-latest-contact-safety-event-title')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-latest-contact-safety-event-detail')),
        findsOneWidget);
    expect(find.text('Contact Card report'), findsOneWidget);
    expect(find.text('LINE contact reported'), findsOneWidget);
    expect(find.text('Block Reported Card'), findsOneWidget);
    expect(find.text('Block'), findsNothing);

    final reportAction = tester.widget<OutlinedButton>(
        find.byKey(const ValueKey('gate0-ledger-report-action')));
    expect(reportAction.onPressed, isNull);
  });

  testWidgets('Gate 0 List tab opens the current Contact Card for review',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-report-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-report-action')));
    await tester.pumpAndSettle();

    expect(find.text('Review Reported Card'), findsOneWidget);
    await scrollToLedgerAction(tester, 'gate0-ledger-review-contact-card');
    await tester
        .tap(find.byKey(const ValueKey('gate0-ledger-review-contact-card')));
    await tester.pumpAndSettle();

    expect(find.text('Chat'), findsWidgets);
    expect(find.text('LINE Contact Card'), findsOneWidget);
    expect(find.text('Report under review'), findsOneWidget);
    expect(
        find.text('Chat stays open while safety reviews it.'), findsOneWidget);
  });

  testWidgets('Gate 0 List tab block action records a safety event',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Blocked users'), findsNothing);

    await scrollToLedgerAction(tester, 'gate0-ledger-block-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-block-action')));
    await tester.pumpAndSettle();

    expect(find.text('1 active block'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-safety-event-row')),
        findsOneWidget);
    expect(find.text('Contact Card block'), findsOneWidget);
    expect(find.text('LINE contact blocked'), findsOneWidget);
    expect(find.text('Block active'), findsOneWidget);
    expect(find.text('Report locked'), findsOneWidget);
    expect(find.text('Blocked users'), findsOneWidget);
    expect(find.text('Alex blocked from Contact Card'), findsOneWidget);
    expect(find.text('LINE cannot reopen while blocked'), findsOneWidget);

    final reportAction = tester.widget<OutlinedButton>(
        find.byKey(const ValueKey('gate0-ledger-report-action')));
    expect(reportAction.onPressed, isNull);
    final blockAction = tester.widget<OutlinedButton>(
        find.byKey(const ValueKey('gate0-ledger-block-action')));
    expect(blockAction.onPressed, isNull);
  });

  testWidgets('Gate 0 List tab opens blocked Contact Card for review',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-block-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-block-action')));
    await tester.pumpAndSettle();

    expect(find.text('Review Blocked Card'), findsOneWidget);
    await scrollToLedgerAction(tester, 'gate0-ledger-review-contact-card');
    await tester
        .tap(find.byKey(const ValueKey('gate0-ledger-review-contact-card')));
    await tester.pumpAndSettle();

    expect(find.text('LINE Contact Card'), findsOneWidget);
    expect(find.text('Block stays active'), findsOneWidget);
    expect(
      find.byKey(const ValueKey('gate0-contact-state-alert-blocked-detail')),
      findsOneWidget,
    );
    expect(find.text('LINE cannot reopen from this chat.'), findsOneWidget);
  });

  testWidgets('Gate 0 List blocked users action opens blocked Contact Card',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-block-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-block-action')));
    await tester.pumpAndSettle();

    expect(find.text('Blocked users'), findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-review-blocked-user');
    expect(
      find.byKey(const ValueKey('gate0-review-blocked-user-label')),
      findsOneWidget,
    );
    await tester.tap(find.byKey(const ValueKey('gate0-review-blocked-user')));
    await tester.pumpAndSettle();

    expect(find.text('LINE Contact Card'), findsOneWidget);
    expect(find.text('Block stays active'), findsOneWidget);
    expect(find.text('LINE cannot reopen from this chat.'), findsOneWidget);
  });

  testWidgets('Gate 0 List Blocks summary opens blocked Contact Card',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-block-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-block-action')));
    await tester.pumpAndSettle();

    expect(find.text('Blocks'), findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-blocks-summary-row')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-blocked-users-summary-row')),
        findsOneWidget);
    expect(find.text('1 active block'), findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-review-blocks-from-summary');
    expect(
      find.byKey(const ValueKey('gate0-review-blocks-from-summary-label')),
      findsOneWidget,
    );
    await tester
        .tap(find.byKey(const ValueKey('gate0-review-blocks-from-summary')));
    await tester.pumpAndSettle();

    expect(find.text('LINE Contact Card'), findsOneWidget);
    expect(find.text('Block stays active'), findsOneWidget);
    expect(find.text('LINE cannot reopen from this chat.'), findsOneWidget);
  });

  testWidgets('Gate 0 List Blocks summary unblocks contact safely',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-block-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-block-action')));
    await tester.pumpAndSettle();

    expect(find.text('1 active block'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-current-blocked-user-row')),
        findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-unblock-from-summary');
    expect(
      find.byKey(const ValueKey('gate0-unblock-from-summary-label')),
      findsOneWidget,
    );
    await tester.tap(find.byKey(const ValueKey('gate0-unblock-from-summary')));
    await tester.pumpAndSettle();

    expect(find.text('Blocked users'), findsNothing);
    expect(find.text('Block removed'), findsOneWidget);
    expect(find.text('No active blocks'), findsOneWidget);
    expect(find.text('Block history retained'), findsOneWidget);
    expect(find.text('Past block remains in event history'), findsOneWidget);
  });

  testWidgets('Gate 0 List blocked users can be unblocked safely',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-block-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-block-action')));
    await tester.pumpAndSettle();

    expect(find.text('Blocked users'), findsOneWidget);
    expect(find.text('1 active block'), findsOneWidget);
    expect(find.text('Block removed'), findsNothing);

    await scrollToLedgerAction(tester, 'gate0-unblock-user');
    expect(
      find.byKey(const ValueKey('gate0-unblock-user-label')),
      findsOneWidget,
    );
    await tester.tap(find.byKey(const ValueKey('gate0-unblock-user')));
    await tester.pumpAndSettle();

    expect(find.text('Blocked users'), findsNothing);
    expect(find.text('Block removed'), findsOneWidget);
    expect(
        find.text('Contact Card locked until you share again'), findsOneWidget);
    expect(find.text('No active blocks'), findsOneWidget);
    expect(find.text('Block history retained'), findsOneWidget);
    expect(find.text('Past block remains in event history'), findsOneWidget);
    expect(find.text('Report history retained'), findsNothing);
    expect(find.text('Share not started'), findsOneWidget);
    expect(find.text('1 safety contact event'), findsOneWidget);
    expect(find.text('Contact Card block'), findsOneWidget);
    expect(find.text('LINE contact blocked'), findsOneWidget);
    expect(find.text('Open Chat to Share'), findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-ledger-open-share');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-open-share')));
    await tester.pumpAndSettle();

    expect(find.text('Share LINE?'), findsOneWidget);
    expect(find.text('Contact Card locked'), findsOneWidget);

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Block removed'), findsNothing);
    expect(find.text('No active blocks'), findsOneWidget);

    await tester.tap(find.text('Chat').last);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Share LINE'));
    await tester.pumpAndSettle();

    expect(find.text('LINE Contact Card'), findsOneWidget);
    expect(find.text('Contact Card can be revoked'), findsOneWidget);

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.text('Block removed'), findsNothing);
    expect(find.text('No active blocks'), findsOneWidget);
    expect(find.text('1 shared Contact Card'), findsOneWidget);
    expect(find.text('Block history retained'), findsOneWidget);
    expect(find.text('Past block remains in event history'), findsOneWidget);

    await scrollToLedgerAction(tester, 'gate0-ledger-block-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-block-action')));
    await tester.pumpAndSettle();

    expect(find.text('1 safety contact event'), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-safety-event-blocked')),
        findsOneWidget);
    expect(find.text('1 active block'), findsOneWidget);
  });

  testWidgets('Gate 0 List block protects Contact Card when Chat reopens it',
      (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();
    await scrollToLedgerAction(tester, 'gate0-ledger-block-action');
    await tester.tap(find.byKey(const ValueKey('gate0-ledger-block-action')));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Chat').last);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Share LINE'));
    await tester.pumpAndSettle();

    expect(find.text('Contact access unavailable'), findsOneWidget);
    expect(find.textContaining('Contact state: Blocked'), findsOneWidget);
    expect(find.textContaining('LINE contact blocked'), findsOneWidget);
    expect(find.textContaining('LINE contact available'), findsNothing);
  });

  testWidgets('Gate 0 List tab shows a safety ledger summary', (tester) async {
    await tester.pumpWidget(const ThaiMeetApp());

    await tester.tap(find.text('List').last);
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('gate0-safety-ledger')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-safety-ledger-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-safety-ledger-subtitle')),
        findsOneWidget);
    expect(
        find.byKey(const ValueKey('gate0-safety-ledger-icon')), findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-cards-summary-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-contact-cards-summary-detail')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-summary-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-public-id-summary-detail')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-current-contact-card-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-current-contact-card-detail')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-reports-summary-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-reports-summary-detail')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-blocks-summary-title')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-blocks-summary-detail')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-ledger-review-contact-card-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-ledger-report-action-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-ledger-block-action-label')),
        findsOneWidget);
    expect(find.byKey(const ValueKey('gate0-ledger-open-share-label')),
        findsOneWidget);
    expect(find.text('Safety Ledger'), findsOneWidget);
    expect(find.text('Contact cards'), findsOneWidget);
    expect(find.text('No contact events yet'), findsOneWidget);
    expect(find.text('2 guarded states'), findsNothing);
    expect(find.text('Reports'), findsOneWidget);
    expect(find.text('No reports pending'), findsOneWidget);
    expect(find.text('Blocks'), findsOneWidget);
    expect(find.text('No active blocks'), findsOneWidget);
    expect(find.text('Raw LINE stays hidden'), findsOneWidget);
  });
}

Future<void> scrollToLedgerAction(WidgetTester tester, String key) async {
  await tester.scrollUntilVisible(
    find.byKey(ValueKey(key)),
    80,
    scrollable: find.byType(Scrollable).first,
  );
  await tester.pumpAndSettle();
}

Future<void> openLineContactCard(WidgetTester tester) async {
  await tester.pumpWidget(const ThaiMeetApp());

  expect(find.text('Discover'), findsWidgets);
  expect(find.text('TM-PTY-031'), findsOneWidget);

  await tester.tap(find.byKey(const ValueKey('gate0-open-profile-detail')));
  await tester.pumpAndSettle();
  expect(find.text('Profile'), findsOneWidget);

  await tester.scrollUntilVisible(
    find.byKey(const ValueKey('gate0-profile-start-chat')),
    80,
    scrollable: find.byType(Scrollable).first,
  );
  await tester.pumpAndSettle();
  await tester.tap(find.byKey(const ValueKey('gate0-profile-start-chat')));
  await tester.pumpAndSettle();
  expect(find.text('Chat'), findsWidgets);
  expect(find.text('Raw LINE ID stays out of chat.'), findsOneWidget);

  await tester.tap(find.text('Share LINE'));
  await tester.pumpAndSettle();
  expect(find.text('LINE sharing'), findsOneWidget);
  expect(find.text('LINE Contact Card'), findsOneWidget);
  expect(find.textContaining('LINE contact available'), findsOneWidget);
}
